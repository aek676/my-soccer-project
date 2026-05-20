import { TestBed } from '@angular/core/testing';
import { UserProfileService } from './user-profile.service';
import { Firestore } from '@angular/fire/firestore';
import { FIRESTORE_FUNCTIONS, FirestoreFunctions } from '../tokens/firestore.token';
import { of } from 'rxjs';

describe('UserProfileService', () => {
  let service: UserProfileService;
  let fnsSpy: jasmine.SpyObj<FirestoreFunctions>;
  const mockDocRef = {} as any;
  const mockFirestore = {} as Firestore;

  beforeEach(() => {
    fnsSpy = jasmine.createSpyObj<FirestoreFunctions>('FirestoreFns', [
      'doc',
      'setDoc',
      'docData',
    ]);

    fnsSpy.doc.and.returnValue(mockDocRef);
    fnsSpy.setDoc.and.returnValue(Promise.resolve());
    fnsSpy.docData.and.returnValue(of({}));

    TestBed.configureTestingModule({
      providers: [
        { provide: Firestore, useValue: mockFirestore },
        { provide: FIRESTORE_FUNCTIONS, useValue: fnsSpy },
      ],
    });

    service = TestBed.inject(UserProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('createProfile should call setDoc with correct data', (done) => {
    const mockUser = { uid: '123', email: 'test@test.com', displayName: 'Test' } as any;
    service.createProfile(mockUser, 'user').then(() => {
      expect(fnsSpy.doc).toHaveBeenCalledWith(jasmine.anything(), 'users', '123');
      expect((fnsSpy.setDoc as jasmine.Spy).calls.argsFor(0)[1]).toEqual(
        jasmine.objectContaining({
          uid: '123',
          email: 'test@test.com',
          username: 'Test',
          role: 'user',
        }),
      );
      done();
    });
  });

  it('getProfile should return undefined when no data', (done) => {
    fnsSpy.docData.and.returnValue(of(null));
    service.getProfile('123').then((result) => {
      expect(result).toBeUndefined();
      done();
    });
  });

  it('getProfile should return profile with data', (done) => {
    const timestamp = { toDate: () => new Date('2024-01-01') };
    fnsSpy.docData.and.returnValue(
      of({ uid: '123', email: 'a@b.com', createdAt: timestamp }),
    );
    service.getProfile('123').then((result) => {
      expect(result).toEqual(
        jasmine.objectContaining({
          uid: '123',
          email: 'a@b.com',
        }),
      );
      done();
    });
  });

  it('profile$ should emit undefined when no data', (done) => {
    fnsSpy.docData.and.returnValue(of(null));
    service.profile$('123').subscribe((result) => {
      expect(result).toBeUndefined();
      done();
    });
  });

  it('profile$ should emit profile with data', (done) => {
    const timestamp = { toDate: () => new Date('2024-01-01') };
    fnsSpy.docData.and.returnValue(
      of({ uid: '123', email: 'a@b.com', createdAt: timestamp }),
    );
    service.profile$('123').subscribe((result) => {
      expect(result).toEqual(
        jasmine.objectContaining({
          uid: '123',
          email: 'a@b.com',
        }),
      );
      done();
    });
  });
});
