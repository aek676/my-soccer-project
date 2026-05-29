import { Component, inject, signal, computed } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonSearchbar,
  IonList,
  IonButton,
  IonFooter,
  IonToolbar,
  IonSpinner,
} from '@ionic/angular/standalone';
import { NavController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Subject, of, firstValueFrom } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';
import { PlayerItemComponent } from '@shared/components/player-item/player-item.component';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { GeolocationService } from '@core/services/geolocation.service';
import { PlayerModel } from '@core/models/player.model';

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
    IonSpinner,
    FormsModule,
    SharedHeaderComponent,
    PlayerItemComponent,
  ],
})
export class ImportPlayersPage {
  private nav = inject(NavController);
  private backendManager = inject(BackendManagerService);
  private toastCtrl = inject(ToastController);
  private geoService = inject(GeolocationService);

  searchQuery = signal('');
  selectedPlayers = signal<Set<string>>(new Set());
  importing = signal(false);

  private searchSubject = new Subject<string>();

  searchResults = toSignal(
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => {
        if (q.length === 0) return of([] as PlayerModel[]);
        return this.backendManager
          .providers()
          .playerProvider.searchPlayers(q)
          .pipe(catchError(() => of([] as PlayerModel[])));
      }),
    ),
    { initialValue: [] as PlayerModel[] },
  );

  filteredPlayers = computed(() => this.searchResults());

  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }

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

  async confirmImport() {
    this.importing.set(true);

    const location = await this.getLocation();
    if (!location) {
      this.importing.set(false);
      const toast = await this.toastCtrl.create({
        message: 'Location is required to import players',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
      return;
    }

    const selected = this.searchResults().filter((p) =>
      this.selectedPlayers().has(String(p.id)),
    );

    if (selected.length === 0) return;

    this.importing.set(true);

    const provider = this.backendManager.providers().playerProvider;

    await Promise.all(
      selected.map(async (player) => {
        const apiPlayerId = Number(player.id);
        try {
          const response = await firstValueFrom(
            provider.importPlayer(apiPlayerId, location),
          );
          const importMessage = response.status === 200
            ? `${player.name} already imported`
            : `${player.name} imported successfully`;

          const toast = await this.toastCtrl.create({
            message: importMessage,
            duration: 2000,
            position: 'bottom',
            color: 'success',
          });
          await toast.present();
        } catch {
          const toast = await this.toastCtrl.create({
            message: `${player.name} could not be imported`,
            duration: 3000,
            position: 'bottom',
            color: 'danger',
          });
          await toast.present();
        }
      }),
    );

    this.importing.set(false);
    this.selectedPlayers.set(new Set());
    this.nav.navigateBack('/tabs/players');
  }

  private async getLocation(): Promise<{
    type: 'Point';
    coordinates: number[];
  } | null> {
    const pos = await this.geoService.getCurrentPosition();
    if (!pos) return null;
    return {
      type: 'Point',
      coordinates: [pos.longitude, pos.latitude],
    };
  }
}
