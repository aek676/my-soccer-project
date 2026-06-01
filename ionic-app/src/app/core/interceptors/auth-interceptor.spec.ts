import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let mockGetIdToken: jasmine.Spy;
  const mockAuth = { currentUser: null } as any;

  beforeEach(() => {
    mockGetIdToken = jasmine.createSpy('getIdToken').and.resolveTo('test-token');
    mockAuth.currentUser = { getIdToken: mockGetIdToken };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Auth, useValue: mockAuth },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when user is authenticated', fakeAsync(() => {
    TestBed.inject(HttpClient).get('/test').subscribe();
    tick();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(mockGetIdToken).toHaveBeenCalledWith(true);
    req.flush({});
  }));

  it('should pass request through when no user is authenticated', fakeAsync(() => {
    mockAuth.currentUser = null;

    TestBed.inject(HttpClient).get('/test').subscribe();
    tick();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  }));
});
