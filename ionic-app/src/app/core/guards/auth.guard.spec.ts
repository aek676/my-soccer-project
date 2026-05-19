import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { of } from 'rxjs';
import { authGuard } from './auth.guard';
import { FIREBASE_AUTH_FUNCTIONS, FirebaseAuthFunctions } from '../tokens/firebase-auth.token';

describe('authGuard', () => {
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
    expect(authGuard).toBeTruthy();
  });

  describe('when user is authenticated', () => {
    it('should return true', (done) => {
      authFnsSpy.user.and.returnValue(of(mockUser));

      const result = TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState),
      ) as any;

      result.subscribe((isAuthenticated: boolean) => {
        expect(isAuthenticated).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('when user is not authenticated', () => {
    it('should navigate to /auth/login and return false', (done) => {
      authFnsSpy.user.and.returnValue(of(null));

      const result = TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState),
      ) as any;

      result.subscribe((isAuthenticated: boolean) => {
        expect(isAuthenticated).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
        done();
      });
    });
  });
});
