import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControlOptions,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonInput,
  IonSpinner,
  IonInputPasswordToggle,
  ToastController,
} from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent,
    IonButton,
    IonInput,
    IonSpinner,
    IonInputPasswordToggle,
  ],
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);

  registerForm: FormGroup;
  submitting = false;

  constructor() {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator } as AbstractControlOptions,
    );
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      group.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.submitting = true;

    try {
      await firstValueFrom(
        this.authService.register(
          this.registerForm.value.email,
          this.registerForm.value.password,
          this.registerForm.value.username,
        ),
      );
      this.router.navigate(['/tabs']);
    } catch (error: unknown) {
      const message = this.getErrorMessage(error);
      const toast = await this.toastCtrl.create({
        message,
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.submitting = false;
    }
  }

  private getErrorMessage(error: unknown): string {
    const code = (error as { code?: string })?.code;
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection';
      default:
        return 'An error occurred. Please try again';
    }
  }
}
