import { Component, inject } from '@angular/core';
import {
  IonContent,
  IonCardHeader,
  IonCardTitle,
  IonCard,
  IonHeader,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonItem,
  IonButton,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { addIcons } from 'ionicons';
import { server, logOutOutline } from 'ionicons/icons';
import { BackendManagerService } from '@core/services/backend-manager.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  imports: [
    IonContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonHeader,
    SharedHeaderComponent,
    IonCardContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonItem,
    IonButton,
    AsyncPipe,
  ],
})
export class ProfilePage {
  protected authService = inject(AuthService);
  protected backendManager = inject(BackendManagerService);
  private navController = inject(NavController);

  constructor() {
    addIcons({ server, logOutOutline });
  }

  logout() {
    this.authService.logout().subscribe({
      complete: () => this.navController.navigateRoot(['/auth/login']),
    });
  }
}
