import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';
import {
  FIREBASE_AUTH_FUNCTIONS,
  FirebaseAuthFunctions,
} from '../tokens/firebase-auth.token';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let authFnsSpy: jasmine.SpyObj<FirebaseAuthFunctions>;
  const mockUser = {
    uid: '123',
    email: 'test@test.com',
    displayName: 'Test User',
  } as any;
  const mockCredential = {
    user: { uid: '123', email: 'test@test.com' },
  } as any;
  const mockAuth = { currentUser: mockUser } as any;

  beforeEach(() => {
    authFnsSpy = jasmine.createSpyObj<FirebaseAuthFunctions>(
      'FirebaseAuthFns',
      [
        'signInWithEmailAndPassword',
        'createUserWithEmailAndPassword',
        'signOut',
        'updateProfile',
        'user',
      ],
    );

    authFnsSpy.user.and.returnValue(of(mockUser));
    authFnsSpy.signInWithEmailAndPassword.and.returnValue(
      Promise.resolve(mockCredential),
    );
    authFnsSpy.createUserWithEmailAndPassword.and.returnValue(
      Promise.resolve(mockCredential),
    );
    authFnsSpy.updateProfile.and.returnValue(Promise.resolve());
    authFnsSpy.signOut.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: mockAuth },
        { provide: FIREBASE_AUTH_FUNCTIONS, useValue: authFnsSpy },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('currentUser$ should emit from user()', (done) => {
    service.currentUser$.subscribe((u) => {
      expect(u).toEqual(mockUser);
      done();
    });
  });

  it('currentUser getter should return auth.currentUser', () => {
    expect(service.currentUser).toBe(mockUser);
  });

  it('login should call signInWithEmailAndPassword', () => {
    service.login('test@test.com', 'password').subscribe();
    expect(authFnsSpy.signInWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      'test@test.com',
      'password',
    );
  });

  it('register should call createUserWithEmailAndPassword and updateProfile', (done) => {
    service.register('test@test.com', 'password', 'Test User').subscribe(() => {
      expect(authFnsSpy.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        'test@test.com',
        'password',
      );
      expect(authFnsSpy.updateProfile).toHaveBeenCalledWith(
        mockCredential.user,
        { displayName: 'Test User' },
      );
      done();
    });
  });

  it('logout should call signOut', () => {
    service.logout().subscribe();
    expect(authFnsSpy.signOut).toHaveBeenCalledWith(mockAuth);
  });
});
