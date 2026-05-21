import { Component, inject } from '@angular/core';
import {
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthStateService } from '@core/services/auth-state.service';
import { AsyncPipe } from '@angular/common';
import { logIn, football } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-shared-header',
  standalone: true,
  imports: [IonToolbar, IonTitle, IonButton, IonIcon, AsyncPipe],
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss'],
})
export class SharedHeaderComponent {
  private authState = inject(AuthStateService);
  private router = inject(Router);

  isGuest$ = this.authState.isGuest$;

  constructor() {
    addIcons({ logIn, football });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
