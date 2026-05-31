import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonIcon, IonContent, IonHeader, IonModal, IonInput, IonToolbar, IonTitle, IonButtons } from '@ionic/angular/standalone';
import { UpperCasePipe } from '@angular/common';
import { PlayerModel } from '@core/models/player.model';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';
import { ToastController } from '@ionic/angular/standalone';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { HttpErrorResponse } from '@angular/common/http';

type PlayerPosition = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
type PlayerRole = 'GK' | 'LB' | 'LCB' | 'RCB' | 'RB' | 'LCM' | 'CDM' | 'RCM' | 'LW' | 'ST' | 'RW';

interface IdealTeamPlayer extends PlayerModel {
  role?: PlayerRole;
}

interface PlayersByPosition {
  goalkeepers: IdealTeamPlayer[];
  defenders: IdealTeamPlayer[];
  midfielders: IdealTeamPlayer[];
  forwards: IdealTeamPlayer[];
}



@Component({
  selector: 'app-ideal-team',
  templateUrl: 'ideal-team.page.html',
  styleUrls: ['ideal-team.page.scss'],
  imports: [IonHeader, IonContent, IonButton, IonIcon, IonModal, IonInput, IonToolbar, IonTitle, IonButtons, FormsModule, SharedHeaderComponent, UpperCasePipe],
})
export class IdealTeamPage {
  private backendManager = inject(BackendManagerService);
  private toastController = inject(ToastController);

  private _squad = signal<IdealTeamPlayer[]>([]);
  private _formation = signal<string>('4-3-3');
  private _isGenerated = signal<boolean>(false);
  private _isLoading = signal<boolean>(false);
  private _showSaveModal = signal<boolean>(false);
  private _teamName = signal<string>('');

  readonly squad = this._squad.asReadonly();
  readonly formation = this._formation.asReadonly();
  readonly isGenerated = this._isGenerated.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly showSaveModal = this._showSaveModal.asReadonly();
  teamName = this._teamName;

  readonly playersByPosition = computed<PlayersByPosition>(() => {
    const squad = this._squad();
    return {
      goalkeepers: squad.filter((p) => p.position === 'Goalkeeper'),
      defenders: squad.filter((p) => p.position === 'Defender'),
      midfielders: squad.filter((p) => p.position === 'Midfielder'),
      forwards: squad.filter((p) => p.position === 'Forward'),
    };
  });

  async generateSquad(): Promise<void> {
    this._isLoading.set(true);
    this.backendManager
      .providers()
      .teamProvider.generateIdealTeam()
      .subscribe({
        next: (players) => {
          this._squad.set(players as IdealTeamPlayer[]);
          this._isGenerated.set(true);
          this._isLoading.set(false);
        },
        error: async (err: HttpErrorResponse) => {
          const message = err.error?.message ?? 'Failed to generate team';
          const toast = await this.toastController.create({
            message,
            duration: 2000,
            position: 'bottom',
            color: 'danger',
          });
          await toast.present();
          this._isLoading.set(false);
        },
      });
  }

  openSaveModal(): void {
    this._showSaveModal.set(true);
  }

  closeSaveModal(): void {
    this._showSaveModal.set(false);
    this._teamName.set('');
  }

  async confirmSaveTeam(): Promise<void> {
    const name = this._teamName();
    if (!name.trim()) {
      const toast = await this.toastController.create({
        message: 'Please enter a team name',
        duration: 2000,
        position: 'bottom',
        color: 'warning',
      });
      await toast.present();
      return;
    }
    const playerIds = this._squad().map((p) => String(p.id));
    this.backendManager
      .providers()
      .teamProvider.saveIdealTeam(name, playerIds)
      .subscribe({
        next: () => {
          this.backendManager.loadTeams();
          this._showSaveModal.set(false);
          this._teamName.set('');
        },
        error: async (err: HttpErrorResponse) => {
          const message = err.error?.message ?? 'Failed to save team';
          const toast = await this.toastController.create({
            message,
            duration: 2000,
            position: 'bottom',
            color: 'danger',
          });
          await toast.present();
        },
      });
  }
}