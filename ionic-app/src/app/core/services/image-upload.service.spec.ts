import { TestBed } from '@angular/core/testing';
import { initializeApp } from 'firebase/app';
import { ImageUploadService } from './image-upload.service';
import { STORAGE_FUNCTIONS } from '@core/tokens/storage.token';

beforeAll(() => {
  initializeApp({
    apiKey: 'test-api-key',
    authDomain: 'test.firebaseapp.com',
    projectId: 'test-project',
    storageBucket: 'test.appspot.com',
  });
});

describe('ImageUploadService', () => {
  let service: ImageUploadService;

  beforeEach(() => {
    const mockRef = jasmine.createSpy('ref');
    mockRef.and.returnValue({} as never);

    const mockUploadString = jasmine.createSpy('uploadString');
    mockUploadString.and.resolveTo();

    const mockGetDownloadURL = jasmine.createSpy('getDownloadURL');
    mockGetDownloadURL.and.resolveTo('https://example.com/photo.jpg');

    TestBed.configureTestingModule({
      providers: [
        ImageUploadService,
        {
          provide: STORAGE_FUNCTIONS,
          useValue: {
            getStorage: jasmine.createSpy('getStorage'),
            ref: mockRef,
            uploadString: mockUploadString,
            getDownloadURL: mockGetDownloadURL,
          },
        },
      ],
    });

    service = TestBed.inject(ImageUploadService);
  });

  describe('uploadPlayerPhoto', () => {
    it('should upload photo without player name and return URL', async () => {
      const blob = new Blob(['fake-image-data'], { type: 'image/jpeg' });
      spyOn(globalThis, 'fetch').and.resolveTo(
        new Response(blob),
      );

      const url = await service.uploadPlayerPhoto('data:image/jpeg,base64,fake');

      expect(url).toBe('https://example.com/photo.jpg');
    });

    it('should upload photo with player name and return URL', async () => {
      const blob = new Blob(['fake-image-data'], { type: 'image/jpeg' });
      spyOn(globalThis, 'fetch').and.resolveTo(
        new Response(blob),
      );

      const url = await service.uploadPlayerPhoto(
        'data:image/jpeg,base64,fake',
        'John Doe',
      );

      expect(url).toBe('https://example.com/photo.jpg');
    });

    it('should propagate fetch errors', async () => {
      spyOn(globalThis, 'fetch').and.rejectWith(
        new Error('Network error'),
      );

      await expectAsync(
        service.uploadPlayerPhoto('data:image/jpeg,base64,fake'),
      ).toBeRejectedWithError('Network error');
    });

    it('should propagate upload errors', async () => {
      const blob = new Blob(['fake-image-data'], { type: 'image/jpeg' });
      spyOn(globalThis, 'fetch').and.resolveTo(
        new Response(blob),
      );

      (service as any).storage.uploadString.and.rejectWith(
        new Error('Upload failed'),
      );

      await expectAsync(
        service.uploadPlayerPhoto('data:image/jpeg,base64,fake'),
      ).toBeRejectedWithError('Upload failed');
    });
  });
});
