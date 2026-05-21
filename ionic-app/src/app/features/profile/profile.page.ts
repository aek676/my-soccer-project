import { Component } from '@angular/core';
import {
  IonContent,
  IonCardHeader,
  IonCardTitle,
  IonCard,
  IonHeader,
  IonCardContent,
} from '@ionic/angular/standalone';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';

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
  ],
})
export class ProfilePage {}
