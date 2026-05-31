import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonIcon, IonContent, IonHeader, IonModal, IonInput, IonToolbar, IonTitle, IonButtons } from '@ionic/angular/standalone';
import { UpperCasePipe } from '@angular/common';
import { PlayerModel } from '@core/models/player.model';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';
import { ToastController } from '@ionic/angular/standalone';
import { BackendManagerService } from '@core/services/backend-manager.service';

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

const MOCK_SQUAD: IdealTeamPlayer[] = [
  {
    id: '1',
    name: 'Alisson',
    position: 'Goalkeeper',
    role: 'GK',
    team: 'Liverpool',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxiq_zbCnqpnANF0twptWM0THwaoUI825eWlRnqgpxS6MnrSl2ph1QkeLq8ivP2ScUKjlXaYI7oOyzaYhWcMHufdNcdnfYYpWf8ovNpi2WRqI7ou-xiBC8NR1QjR2CEr3zuzo9PKD54BgeNyln2z2bkjguaepjYYQ4VLKqFEzttM74s6EeHeE3hVTP6PkNzh04YJKQl9Rxg6-pE_zLhoHNOJHpv76yF9s_Vahncb17jzJr85qYJNnjxEt3jJHNNuAA_ogiQbv9OpTd',
  },
  {
    id: '2',
    name: 'Davies',
    position: 'Defender',
    role: 'LB',
    team: 'Bayern München',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRvhNNydGyM9rV-vUnCssV8Qkn7wcVwjyzN6CFZpuUrj6MK8NvFMZNLrAJGkGR6WhrYcKioyXdSuP9TLepuDg2Bu3ZoclDrRNJHzTtb2OJA5kXpJaQ93HwULy19WfPHzR2vdGmBtrZGEIbsHX-5SZSIuGMwqAHIsyYYBibAjpDd3Mcne0qnWsc-WDTT26X9-R2d0I1j6kecDE2n15hCD4fk4JMAPMB-v5b_TuVdHIi_rXljCfh2AK7rOkxrRI6qkebRfnnZ_7NUG8_',
  },
  {
    id: '3',
    name: 'Dias',
    position: 'Defender',
    role: 'LCB',
    team: 'Manchester City',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCREYLNDw8s6rRrsn1QzlFXE9TDsiw6r8zjtHJ8N9hBfWao8QO79ME-JP9Yz7YiwDth46FAerns5LfaTTzNlfw16Ychg84TE8rs6IAVQGlE4OriegZFq6jIgZey_uvPdoQFGugeOyJlAEmCaqi3KKF7zfRz2z-OPnpMjewSk97aIJoyrnNys92dFRhcrg3me7fBjQKrBg12KYywnAbvfxb-Ldjo_YjU4qeTtriGkvoZUReD-N25NmIWrbdixGWFzmwoUKQi-v1YMpyj',
  },
  {
    id: '4',
    name: 'Saliba',
    position: 'Defender',
    role: 'RCB',
    team: 'Arsenal',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRmkFH0xk4MgXbrASYWJPjwq8AeUg0EBxlyrlh9DTi3lrFpnVtKcrP-DRVGirIfSxfdWNPnlXPAc66SNWr8X2rycMC1iqTCeC43Dh1AGOsjgoBvAmyYq0wInGwpy6_DXNuA1Ao8IeLPOME5DItaexXtTypAuhZ4fVyWk5n9Sdckatk3ObWxcRIJ0IJxQfGScppBQ-4C-GYK6BEw8_-nl-q-xuxfeDXXdbAERgFBqJAATA8gnQoJN_EVitmW8Syg8HAlbddkiO0Cc7_',
  },
  {
    id: '5',
    name: 'Walker',
    position: 'Defender',
    role: 'RB',
    team: 'Manchester City',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF8hD3ZEd5EtKr06Nzh0SlKCPQsl-1Vlr16oMYmGP902EJBCKXUzmkUzjE84ej-aZY2wd4HFi-SMpTPOX1zFSq7z3KwO2iSl6RjVP1pd5F7r8iJFviB8qlASj5H6M0PWk-BXlku5aoOA_M7UeLpa0GhTsTEuVKBpb25bl80lVDgxRe-t7vpndJVTFlWS5eFDxaLxvhTn5NBiCNPVrQih6bAOXOlqNQ5NVU-53thMehiAJY9tw9rloDYLrI492Ip04FBqCwW78gdQdj',
  },
  {
    id: '6',
    name: 'Bellingham',
    position: 'Midfielder',
    role: 'LCM',
    team: 'Real Madrid',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs-XZVdCG5IK7IftW9-znw5znePMykeGKgIRZC0u7mHXqZslgSHyTOLl4TSOKeR9KxVSOF4cFxG63VAA5ZOFPIhmMhQlhSmliHzrq3G9yLBe-bcYeZCuDvXdOIPUkdk8Ri1NJgKhqZjtTR9E4_erKI5WkowBJxDXwLjfKHolIwNZso0ScvPgeSAysLwTGH0GKghSuk9O2HkFZz4EHkZYo6iTJq8U6y6T5WK29ODLRty8enXQhDJyO9hOYS6iJACXIYkVoLpmeWwNi6',
  },
  {
    id: '7',
    name: 'Rodri',
    position: 'Midfielder',
    role: 'CDM',
    team: 'Manchester City',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZpdZZwNPAiayWe9uuHIdb-Wlu1V__ZjoatplptRtRPSJHHotLpbX1oeuG4G6AVFY3F--6nioKZ0b_hmZb9CCLibApVz9NG57KD0laGnJAjJL9cmP52ZeggNiE7FVfYejqvlvcnkJrJfVZ_MzDa4lDUnV0-xxW7vHFCOo_53KaRIa7anTl28wY1dhq1O1LHGnytxZc7qh18_zn-7IxPXfAEtKNUj_090J1RgkQJcNZeVsOGtdAc8NEpm9ynrPWUbvkJtPhdFUFRhTP',
  },
  {
    id: '8',
    name: 'De Bruyne',
    position: 'Midfielder',
    role: 'RCM',
    team: 'Manchester City',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtatbkCJpTD5UaqjpTDiwGcZ4OjyIGwP95r2ZAoYMlOmUYnRawoJHJf4i7stVbQffxIFqzKO0Fwas0i4Tlh31vNOBwGmjbp7YDjVc-BxUruayq9YIhLiNbS0WTDGD89rb7np07MiIkcvG7DD6b-It3pjIa2-gPnFoKDk-ScDp5JrXrR65vpsdTq3cI7IrCAuEYt1XWHsw4w3CD3-6nzB6xEWtgGgE3Ds7RAFTD51DYeceWwI2esCzYfX0dMWbNAJGoFZKRjyLrRG4L',
  },
  {
    id: '9',
    name: 'Vinícius Jr',
    position: 'Forward',
    role: 'LW',
    team: 'Real Madrid',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ6bXmdAYdF0kzpjphfKqreDsCWM5wJ40oDbCPIXiGx5k8lfSG3rpwGD2BA2eMwCnaUvRQ7BzlUtOjS2YNmjqeSrJk0lDMi4L3r8OXWdu4yVXb68fi87LD0wbG-Cfi5UTyq42FvSc5DusL_SSAlvkq0p491FFaDCWHOZQUVRcV7384L3gpbyMJd36M0cLUh5WAIdZJGzGn6On0hGrKh3DaPy1d6A3CpWmuE85Ow_zfLBATIbwkbEnqdAfPXzNvkQG-ynxr8SUXqqWC',
  },
  {
    id: '10',
    name: 'Haaland',
    position: 'Forward',
    role: 'ST',
    team: 'Manchester City',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc7lbV9xpvK-vG3wfoaNT6KnHKL6dtxmotTsZW449oiWrX56S1h0bAoyUxv9yf26S6idw7udZoBp6lUjfLJ_wzp1RtlBKnzIKJz0KZ8WxoububaPjKQLOsvYtRwug-eyX3GkUzG-nhJYutdubdd68B0Ua5qH6HA548w9qa7zNhHg3kOyYcczqlXculyHfR8Nb74El2gI3AlT4dqXdWcpnc07tgfjUTyfm881ZhhXR_9ipAFbCR0HUZ1tzGaErtij3e7syuLIEBn1nx',
  },
  {
    id: '11',
    name: 'Saka',
    position: 'Forward',
    role: 'RW',
    team: 'Arsenal',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASymC0CDCbB1So1N7-Uy5u0oVgFCf233F8pZn8s6mh5Kf-OmBTO-TgnqoxHBdMxlTsVHboNEOxP1PO0L-nubbPJAEv6ApAxH3YpHt9NdEJAZ02ZJWUQlRcuMmlzmQQpdTUEkQvDtbScIu0_g_gnAoa844ZRDLOkCdNURYeAAeAMoav12uRvAfOsBdWvLy6lGJ9Rg_4r6rNDpPok1IAFgDRCg_v33-4lpUDYISWsy1nLywp3KaJUcbE8Yg2xEtop48-I4xc4IWvLuHl',
  },
];

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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    this._squad.set([...MOCK_SQUAD]);
    this._isGenerated.set(true);
    this._isLoading.set(false);
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
    this._showSaveModal.set(false);
    const toast = await this.toastController.create({
      message: `Team "${name}" saved successfully`,
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
    this._teamName.set('');
  }
}