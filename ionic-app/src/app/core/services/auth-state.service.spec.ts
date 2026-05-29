import { TestBed } from '@angular/core/testing';
import { Observable, of, Subject } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';

describe('AuthStateService', () => {
  let service: AuthStateService;
  let currentUserSubject: Subject<User | null>;
  let mockAuthService: Partial<AuthService>;

  const createMockUser = (
    isAnonymous: boolean,
    roleClaim?: string,
  ): Partial<User> => {
    let getIdTokenResult: () => Promise<any>;
    if (roleClaim) {
      getIdTokenResult = () =>
        Promise.resolve({ claims: { role: roleClaim } });
    } else {
      getIdTokenResult = () => Promise.resolve({ claims: {} });
    }
    return { isAnonymous, getIdTokenResult } as any;
  };

  beforeEach(() => {
    currentUserSubject = new Subject<User | null>();
    mockAuthService = {
      currentUser$: currentUserSubject.asObservable(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthStateService,
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    service = TestBed.inject(AuthStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('role$', () => {
    it('should emit "guest" when user is null', (done) => {
      service.role$.subscribe((role) => {
        expect(role).toBe('guest');
        done();
      });
      currentUserSubject.next(null);
    });

    it('should emit "guest" when user is anonymous', (done) => {
      service.role$.subscribe((role) => {
        expect(role).toBe('guest');
        done();
      });
      currentUserSubject.next(createMockUser(true) as User);
    });

    it('should emit "user" when user has no custom role claim', (done) => {
      service.role$.subscribe((role) => {
        expect(role).toBe('user');
        done();
      });
      currentUserSubject.next(createMockUser(false) as User);
    });

    it('should emit "admin" when user has role claim', (done) => {
      service.role$.subscribe((role) => {
        expect(role).toBe('admin');
        done();
      });
      currentUserSubject.next(createMockUser(false, 'admin') as User);
    });

    it('should emit the correct role claim value', (done) => {
      service.role$.subscribe((role) => {
        expect(role).toBe('scout' as any);
        done();
      });
      currentUserSubject.next(createMockUser(false, 'scout') as User);
    });
  });

  describe('derived observables', () => {
    it('isGuest$ should be true for guest', (done) => {
      service.isGuest$.subscribe((v) => {
        expect(v).toBeTrue();
        done();
      });
      currentUserSubject.next(null);
    });

    it('isAuthenticated$ should be true for authenticated user', (done) => {
      service.isAuthenticated$.subscribe((v) => {
        expect(v).toBeTrue();
        done();
      });
      currentUserSubject.next(createMockUser(false, 'admin') as User);
    });
  });
});
