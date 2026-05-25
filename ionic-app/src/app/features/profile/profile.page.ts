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
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { BackendConfigurationService } from '@core/services/backend-configuration.service';
import { addIcons } from 'ionicons';
import { server, logOutOutline } from 'ionicons/icons';

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
  protected backendConfig = inject(BackendConfigurationService);

  constructor() {
    addIcons({ server, logOutOutline });
  }
}
