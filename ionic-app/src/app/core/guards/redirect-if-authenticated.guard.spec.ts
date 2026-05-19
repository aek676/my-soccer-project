import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { of } from 'rxjs';
import { redirectIfAuthenticated } from './redirect-if-authenticated.guard';
import { FIREBASE_AUTH_FUNCTIONS, FirebaseAuthFunctions } from '../tokens/firebase-auth.token';

describe('redirectIfAuthenticated', () => {
  let router: jasmine.SpyObj<Router>;
  let authFnsSpy: jasmine.SpyObj<FirebaseAuthFunctions>;
  const mockUser = { uid: '123', email: 'test@test.com' } as any;
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;
  const mockAuth = {} as any;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    authFnsSpy = jasmine.createSpyObj<FirebaseAuthFunctions>('FirebaseAuthFns', ['user']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: Auth, useValue: mockAuth },
        { provide: FIREBASE_AUTH_FUNCTIONS, useValue: authFnsSpy },
      ],
    });
  });

  it('should be created', () => {
    expect(redirectIfAuthenticated).toBeTruthy();
  });

  describe('when user is authenticated', () => {
    it('should navigate to /tabs and return false', (done) => {
      authFnsSpy.user.and.returnValue(of(mockUser));

      const result = TestBed.runInInjectionContext(() =>
        redirectIfAuthenticated(mockRoute, mockState),
      ) as any;

      result.subscribe((canActivate: boolean) => {
        expect(canActivate).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/tabs']);
        done();
      });
    });
  });

  describe('when user is not authenticated', () => {
    it('should return true without navigating', (done) => {
      authFnsSpy.user.and.returnValue(of(null));

      const result = TestBed.runInInjectionContext(() =>
        redirectIfAuthenticated(mockRoute, mockState),
      ) as any;

      result.subscribe((canActivate: boolean) => {
        expect(canActivate).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
