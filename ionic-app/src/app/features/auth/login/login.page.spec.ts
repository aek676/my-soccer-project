import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { LoginPage } from './login.page';
import { AuthService } from '../../../core/services/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;
  let toastCtrlSpy: jasmine.SpyObj<ToastController>;
  let toastSpy: jasmine.SpyObj<HTMLIonToastElement>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'loginAsGuest']);
    toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);
    toastSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastCtrlSpy.create.and.returnValue(Promise.resolve(toastSpy));

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastController, useValue: toastCtrlSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loginForm with email and password controls', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should have email control with required and email validators', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTrue();
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTrue();
    emailControl?.setValue('valid@test.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should have password control with required validator', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBeTrue();
    passwordControl?.setValue('somepassword');
    expect(passwordControl?.valid).toBeTrue();
  });

  it('should have submitting set to false initially', () => {
    expect(component.submitting).toBeFalse();
  });

  describe('onSubmit', () => {
    it('should mark all controls as touched when form is invalid', fakeAsync(() => {
      component.onSubmit();
      tick();
      expect(component.loginForm.get('email')?.touched).toBeTrue();
      expect(component.loginForm.get('password')?.touched).toBeTrue();
    }));

    it('should not call authService.login when form is invalid', fakeAsync(() => {
      component.onSubmit();
      tick();
      expect(authServiceSpy.login).not.toHaveBeenCalled();
    }));

    it('should call authService.login with form values when valid', fakeAsync(() => {
      authServiceSpy.login.and.returnValue(of({} as any));
      spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
      component.loginForm.setValue({
        email: 'test@test.com',
        password: 'password123',
      });
      component.onSubmit();
      tick();
      expect(authServiceSpy.login).toHaveBeenCalledWith(
        'test@test.com',
        'password123',
      );
    }));

    it('should set submitting to true during login and false after success', fakeAsync(() => {
      authServiceSpy.login.and.returnValue(of({} as any));
      spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
      component.loginForm.setValue({
        email: 'test@test.com',
        password: 'password123',
      });
      component.onSubmit();
      expect(component.submitting).toBeTrue();
      tick();
      expect(component.submitting).toBeFalse();
    }));

    it('should navigate to /tabs on successful login', fakeAsync(() => {
      authServiceSpy.login.and.returnValue(of({} as any));
      component.loginForm.setValue({
        email: 'test@test.com',
        password: 'password123',
      });
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(
        Promise.resolve(true),
      );
      component.onSubmit();
      tick();
      expect(navigateSpy).toHaveBeenCalledWith(['/tabs']);
    }));

    it('should show error toast on login failure', fakeAsync(() => {
      authServiceSpy.login.and.returnValue(
        throwError(() => ({ code: 'auth/invalid-credential' })),
      );
      component.loginForm.setValue({
        email: 'test@test.com',
        password: 'wrongpassword',
      });
      component.onSubmit();
      tick();
      expect(toastCtrlSpy.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          message: 'Invalid email or password',
          duration: 3000,
          position: 'bottom',
          color: 'danger',
        }),
      );
      expect(toastSpy.present).toHaveBeenCalled();
    }));

    it('should set submitting to false after login failure', fakeAsync(() => {
      authServiceSpy.login.and.returnValue(
        throwError(() => ({ code: 'auth/network-request-failed' })),
      );
      component.loginForm.setValue({
        email: 'test@test.com',
        password: 'password123',
      });
      component.onSubmit();
      tick();
      expect(component.submitting).toBeFalse();
    }));
  });

  describe('getErrorMessage', () => {
    it('should return "Invalid email or password" for auth/invalid-credential', () => {
      expect(
        (component as any).getErrorMessage({ code: 'auth/invalid-credential' }),
      ).toBe('Invalid email or password');
    });

    it('should return "Invalid email or password" for auth/user-not-found', () => {
      expect(
        (component as any).getErrorMessage({ code: 'auth/user-not-found' }),
      ).toBe('Invalid email or password');
    });

    it('should return "Invalid email or password" for auth/wrong-password', () => {
      expect(
        (component as any).getErrorMessage({ code: 'auth/wrong-password' }),
      ).toBe('Invalid email or password');
    });

    it('should return "Please enter a valid email address" for auth/invalid-email', () => {
      expect(
        (component as any).getErrorMessage({ code: 'auth/invalid-email' }),
      ).toBe('Please enter a valid email address');
    });

    it('should return "Too many attempts. Please try again later" for auth/too-many-requests', () => {
      expect(
        (component as any).getErrorMessage({ code: 'auth/too-many-requests' }),
      ).toBe('Too many attempts. Please try again later');
    });

    it('should return "Network error. Check your connection" for auth/network-request-failed', () => {
      expect(
        (component as any).getErrorMessage({
          code: 'auth/network-request-failed',
        }),
      ).toBe('Network error. Check your connection');
    });

    it('should return "An error occurred. Please try again" for unknown error', () => {
      expect((component as any).getErrorMessage({ code: 'unknown' })).toBe(
        'An error occurred. Please try again',
      );
    });

    it('should return default message for error without code', () => {
      expect((component as any).getErrorMessage(new Error('some error'))).toBe(
        'An error occurred. Please try again',
      );
    });
  });

  describe('continueAsGuest', () => {
    it('should navigate to /tabs', fakeAsync(() => {
      authServiceSpy.loginAsGuest.and.returnValue(of({} as any));
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(
        Promise.resolve(true),
      );
      component.continueAsGuest();
      tick();
      expect(navigateSpy).toHaveBeenCalledWith(['/tabs']);
    }));
  });
});
