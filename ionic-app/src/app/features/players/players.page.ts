import { Component, inject, signal, computed } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonSearchbar,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
  ActionSheetController,
} from '@ionic/angular/standalone';
import { NavController, ViewWillEnter } from '@ionic/angular';
import { add, personAdd, cloudDownload } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';
import { PlayerItemComponent } from '@shared/components/player-item/player-item.component';
import {
  FilterChipsComponent,
  FilterSelection,
} from '@shared/components/filter-chips/filter-chips.component';
import { PlayerModel } from '@core/models/player.model';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { AuthStateService } from '@core/services/auth-state.service';

@Component({
  selector: 'app-players',
  templateUrl: 'players.page.html',
  styleUrls: ['players.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonSearchbar,
    IonList,
    IonFab,
    IonFabButton,
    IonIcon,
    FormsModule,
    AsyncPipe,
    SharedHeaderComponent,
    PlayerItemComponent,
    FilterChipsComponent,
  ],
})
export class PlayersPage implements ViewWillEnter {
  private actionSheetCtrl = inject(ActionSheetController);
  private backendManager = inject(BackendManagerService);
  private navController = inject(NavController);
  private authState = inject(AuthStateService);

  players = this.backendManager.players;
  isGuest$ = this.authState.isGuest$;

  ionViewWillEnter() {
    this.backendManager.loadPlayers();
  }

  searchQuery = signal('');
  filters = ['Team', 'League', 'Date Added'];
  selectedFilter = signal<FilterSelection | null>(null);

  filteredPlayers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const filter = this.selectedFilter();
    let result = this.players();

    if (query) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.position?.toLowerCase().includes(query) ||
          p.team?.toLowerCase().includes(query) ||
          p.league?.toLowerCase().includes(query) ||
          p.nationality?.toLowerCase().includes(query),
      );
    }

    if (filter) {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        switch (filter.filter) {
          case 'Team':
            cmp = (a.team ?? '').localeCompare(b.team ?? '');
            break;
          case 'League':
            cmp = (a.league ?? '').localeCompare(b.league ?? '');
            break;
          case 'Date Added': {
            const toTime = (d?: string) => (d ? new Date(d).getTime() : 0);
            cmp = toTime(a.created) - toTime(b.created);
            break;
          }
        }
        return filter.direction === 'desc' ? -cmp : cmp;
      });
    }

    return result;
  });

  constructor() {
    addIcons({ add, personAdd, cloudDownload });
  }

  navigateToProfile(player: PlayerModel) {
    this.navController.navigateForward('/profile-player/' + player.id);
  }

  async openAddActionSheet() {
    const sheet = await this.actionSheetCtrl.create({
      header: 'Add Player',
      buttons: [
        {
          text: 'Add Manually',
          icon: 'person-add',
          handler: () => {},
        },
        {
          text: 'Import from API',
          icon: 'cloud-download',
          handler: async () => {
            await sheet.dismiss();
            this.navController.navigateForward('/import-players');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await sheet.present();
  }
}
