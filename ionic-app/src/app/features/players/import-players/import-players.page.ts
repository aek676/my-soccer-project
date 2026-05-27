import { Component, inject, signal, computed } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonSearchbar,
  IonList,
  IonButton,
  IonFooter,
  IonToolbar,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';
import { PlayerItemComponent } from '@shared/components/player-item/player-item.component';
import { BackendManagerService } from '@core/services/backend-manager.service';

@Component({
  selector: 'app-import-players',
  templateUrl: './import-players.page.html',
  styleUrls: ['./import-players.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonSearchbar,
    IonList,
    IonButton,
    IonFooter,
    IonToolbar,
    FormsModule,
    SharedHeaderComponent,
    PlayerItemComponent,
  ],
})
export class ImportPlayersPage {
  private nav = inject(NavController);
  private backendManager = inject(BackendManagerService);

  players = this.backendManager.players;
  searchQuery = signal('');
  selectedPlayers = signal<Set<string>>(new Set());

  filteredPlayers = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return q
      ? this.players().filter((p) => p.name.toLowerCase().includes(q))
      : this.players();
  });

  togglePlayer(id: string, checked: boolean) {
    this.selectedPlayers.update((s) => {
      const next = new Set(s);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  }

  isSelected(id: string) {
    return this.selectedPlayers().has(id);
  }

  goBack() {
    this.nav.back();
  }

  confirmImport() {
    const selected = this.players().filter((p) =>
      this.selectedPlayers().has(p.id),
    );
    console.log('Selected players:', selected);
    this.nav.navigateBack('/tabs/players');
  }
}
