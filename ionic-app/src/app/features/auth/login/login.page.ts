import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonInput,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent,
    IonButton,
    IonInput,
    IonIcon,
    IonSpinner,
  ],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm: FormGroup;
  showPassword = false;
  submitting = false;

  constructor() {
    addIcons({ eye, eyeOff });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    console.log('=== Login Form Submitted ===');
    console.log(this.loginForm.value);

    this.submitting = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.router.navigate(['/tabs']);
    } finally {
      this.submitting = false;
    }
  }

  continueAsGuest() {
    this.router.navigate(['/tabs']);
  }
}
