import { Component, inject, signal } from '@angular/core';
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
  IonChip,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { addIcons } from 'ionicons';
import { server, logOutOutline, chevronDownOutline, chevronUpOutline, personOutline, trophyOutline } from 'ionicons/icons';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { UpperCasePipe, DatePipe } from '@angular/common';

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
    IonChip,
    AsyncPipe,
    UpperCasePipe,
    DatePipe,
  ],
})
export class ProfilePage {
  protected authService = inject(AuthService);
  protected backendManager = inject(BackendManagerService);
  private navController = inject(NavController);

  private _expandedTeamId = signal<string | null>(null);

  readonly expandedTeamId = this._expandedTeamId.asReadonly();
  readonly teams = this.backendManager.teams;

  constructor() {
    addIcons({ server, logOutOutline, chevronDownOutline, chevronUpOutline, personOutline, trophyOutline });
  }

  toggleTeam(teamId: string): void {
    if (this._expandedTeamId() === teamId) {
      this._expandedTeamId.set(null);
    } else {
      this._expandedTeamId.set(teamId);
    }
  }

  isTeamExpanded(teamId: string): boolean {
    return this._expandedTeamId() === teamId;
  }

  logout() {
    this.authService.logout().subscribe({
      complete: () => this.navController.navigateRoot(['/auth/login']),
    });
  }
}
