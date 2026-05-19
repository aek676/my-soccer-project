import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { RegisterPage } from './register.page';
import { AuthService } from '../../../core/services/auth.service';
import { of, throwError } from 'rxjs';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;
  let toastCtrlSpy: jasmine.SpyObj<ToastController>;
  let toastSpy: jasmine.SpyObj<HTMLIonToastElement>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);
    toastSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastCtrlSpy.create.and.returnValue(Promise.resolve(toastSpy));

    await TestBed.configureTestingModule({
      imports: [RegisterPage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastController, useValue: toastCtrlSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize registerForm with username, email, password, and confirmPassword controls', () => {
    expect(component.registerForm.contains('username')).toBeTrue();
    expect(component.registerForm.contains('email')).toBeTrue();
    expect(component.registerForm.contains('password')).toBeTrue();
    expect(component.registerForm.contains('confirmPassword')).toBeTrue();
  });

  it('should have username control with required and minLength validators', () => {
    const control = component.registerForm.get('username');
    control?.setValue('');
    expect(control?.hasError('required')).toBeTrue();
    control?.setValue('a');
    expect(control?.hasError('minlength')).toBeTrue();
    control?.setValue('valid');
    expect(control?.valid).toBeTrue();
  });

  it('should have email control with required and email validators', () => {
    const control = component.registerForm.get('email');
    control?.setValue('');
    expect(control?.hasError('required')).toBeTrue();
    control?.setValue('invalid-email');
    expect(control?.hasError('email')).toBeTrue();
    control?.setValue('valid@test.com');
    expect(control?.valid).toBeTrue();
  });

  it('should have password control with required and minLength(8) validators', () => {
    const control = component.registerForm.get('password');
    control?.setValue('');
    expect(control?.hasError('required')).toBeTrue();
    control?.setValue('short');
    expect(control?.hasError('minlength')).toBeTrue();
    control?.setValue('validpass123');
    expect(control?.valid).toBeTrue();
  });

  it('should have confirmPassword control that is invalid when empty and other fields are valid', () => {
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123',
      confirmPassword: '',
    });
    const control = component.registerForm.get('confirmPassword');
    expect(control?.invalid).toBeTrue();
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(control?.valid).toBeTrue();
  });

  it('should have submitting set to false initially', () => {
    expect(component.submitting).toBeFalse();
  });

  describe('passwordMatchValidator', () => {
    it('should set passwordMismatch error when passwords do not match', () => {
      component.registerForm.setValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'different',
      });
      const confirmControl = component.registerForm.get('confirmPassword');
      expect(confirmControl?.hasError('passwordMismatch')).toBeTrue();
    });

    it('should not set passwordMismatch error when passwords match', () => {
      component.registerForm.setValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      const confirmControl = component.registerForm.get('confirmPassword');
      expect(confirmControl?.hasError('passwordMismatch')).toBeFalse();
    });
  });

  describe('onSubmit', () => {
    it('should mark all controls as touched when form is invalid', fakeAsync(() => {
      component.onSubmit();
      tick();
      expect(component.registerForm.get('username')?.touched).toBeTrue();
      expect(component.registerForm.get('email')?.touched).toBeTrue();
      expect(component.registerForm.get('password')?.touched).toBeTrue();
      expect(component.registerForm.get('confirmPassword')?.touched).toBeTrue();
    }));

    it('should not call authService.register when form is invalid', fakeAsync(() => {
      component.onSubmit();
      tick();
      expect(authServiceSpy.register).not.toHaveBeenCalled();
    }));

    it('should call authService.register with form values when valid', fakeAsync(() => {
      authServiceSpy.register.and.returnValue(of({} as any));
      spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
      component.registerForm.setValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      component.onSubmit();
      tick();
      expect(authServiceSpy.register).toHaveBeenCalledWith(
        'test@test.com',
        'password123',
        'testuser',
      );
    }));

    it('should set submitting to true during registration and false after success', fakeAsync(() => {
      authServiceSpy.register.and.returnValue(of({} as any));
      spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
      component.registerForm.setValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      component.onSubmit();
      expect(component.submitting).toBeTrue();
      tick();
      expect(component.submitting).toBeFalse();
    }));

    it('should navigate to /tabs on successful registration', fakeAsync(() => {
      authServiceSpy.register.and.returnValue(of({} as any));
      component.registerForm.setValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(
        Promise.resolve(true),
      );
      component.onSubmit();
      tick();
      expect(navigateSpy).toHaveBeenCalledWith(['/tabs']);
    }));

    it('should show error toast on registration failure', fakeAsync(() => {
      authServiceSpy.register.and.returnValue(
        throwError(() => ({ code: 'auth/email-already-in-use' })),
      );
      component.registerForm.setValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      component.onSubmit();
      tick();
      expect(toastCtrlSpy.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          message: 'This email is already registered',
          duration: 3000,
          position: 'bottom',
          color: 'danger',
        }),
      );
      expect(toastSpy.present).toHaveBeenCalled();
    }));

    it('should set submitting to false after registration failure', fakeAsync(() => {
      authServiceSpy.register.and.returnValue(
        throwError(() => ({ code: 'auth/network-request-failed' })),
      );
      component.registerForm.setValue({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      component.onSubmit();
      tick();
      expect(component.submitting).toBeFalse();
    }));
  });

  describe('getErrorMessage', () => {
    it('should return "This email is already registered" for auth/email-already-in-use', () => {
      expect(
        (component as any).getErrorMessage({
          code: 'auth/email-already-in-use',
        }),
      ).toBe('This email is already registered');
    });

    it('should return "Please enter a valid email address" for auth/invalid-email', () => {
      expect(
        (component as any).getErrorMessage({ code: 'auth/invalid-email' }),
      ).toBe('Please enter a valid email address');
    });

    it('should return "Password should be at least 6 characters" for auth/weak-password', () => {
      expect(
        (component as any).getErrorMessage({ code: 'auth/weak-password' }),
      ).toBe('Password should be at least 6 characters');
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
});
