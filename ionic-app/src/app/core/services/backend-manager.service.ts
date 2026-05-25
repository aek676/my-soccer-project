import { computed, Injectable, signal } from '@angular/core';
import { BackendContext } from '@core/context/backend-context';
import { NodeBackend } from '@core/creators/backends/node-backend';
import { SpringBackend } from '@core/creators/backends/spring-backend';
import { PlayerProviderInterface } from '@core/providers/player-provider.interface';
import { TeamProviderInterface } from '@core/providers/team-provider.interface';
import { BackendConfigType } from '@core/types/backend-config.type';

export type BackenType = 'NODE' | 'SPRING';
const CONFIG: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };

interface Providers {
  playerProvider: PlayerProviderInterface;
  teamProvider: TeamProviderInterface;
}
@Injectable({
  providedIn: 'root',
})
export class BackendManagerService {
  private context = new BackendContext(new NodeBackend(CONFIG));
  private _currentBackend = signal<BackenType>('NODE');
  private _providers = signal<Providers>(this.context.init());

  readonly currentBackend = this._currentBackend.asReadonly();
  readonly providers = this._providers.asReadonly();

  readonly players = computed(
    () => this._providers()?.playerProvider.getPlayers() ?? [],
  );
  readonly teams = computed(
    () => this._providers()?.teamProvider.getTeams() ?? [],
  );

  toggleBackend() {
    this._currentBackend.update((v) => (v === 'NODE' ? 'SPRING' : 'NODE'));
    const factory =
      this._currentBackend() === 'NODE'
        ? new NodeBackend(CONFIG)
        : new SpringBackend(CONFIG);

    this.context.strategy = factory;
    this._providers.set(this.context.init());
  }
}
