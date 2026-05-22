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
import { add, personAdd, cloudDownload } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';
import { PlayerItemComponent } from '@shared/components/player-item/player-item.component';
import { FilterChipsComponent, FilterSelection } from '@shared/components/filter-chips/filter-chips.component';
import { Player } from '@core/services/models/player.model';

const MOCK_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Marcus Rashford',
    position: 'Forward',
    number: 10,
    age: 26,
    photoUrl: 'https://i.pravatar.cc/64?img=11',
  },
  {
    id: '2',
    name: 'Jude Bellingham',
    position: 'Midfielder',
    number: 5,
    age: 20,
  },
  {
    id: '3',
    name: 'Bukayo Saka',
    position: 'Winger',
    number: 7,
    age: 22,
    photoUrl: 'https://i.pravatar.cc/64?img=12',
  },
  {
    id: '4',
    name: 'Declan Rice',
    position: 'Defensive Midfielder',
    number: 41,
    age: 25,
    photoUrl: 'https://i.pravatar.cc/64?img=13',
  },
];

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
    SharedHeaderComponent,
    PlayerItemComponent,
    FilterChipsComponent,
  ],
})
export class PlayersPage {
  private actionSheetCtrl = inject(ActionSheetController);

  searchQuery = '';
  filters = ['Team', 'League', 'Date Added'];
  selectedFilter = signal<FilterSelection | null>(null);
  players = MOCK_PLAYERS;

  filteredPlayers = computed(() => {
    const query = this.searchQuery.toLowerCase();
    if (!query) return this.players;
    return this.players.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.position.toLowerCase().includes(query)
    );
  });

  constructor() {
    addIcons({ add, personAdd, cloudDownload });
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
          handler: () => {},
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
