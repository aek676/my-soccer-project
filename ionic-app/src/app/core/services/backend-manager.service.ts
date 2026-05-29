import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { BackendContext } from '@core/context/backend-context';
import { NodeBackend } from '@core/creators/backends/node-backend';
import { SpringBackend } from '@core/creators/backends/spring-backend';
import { CommentProviderInterface } from '@core/providers/comment-provider.interface';
import { PlayerProviderInterface } from '@core/providers/player-provider.interface';
import { TeamProviderInterface } from '@core/providers/team-provider.interface';
import { BackendConfigType } from '@core/types/backend-config.type';
import { environment } from 'src/environments/environment';

export type BackenType = 'NODE' | 'SPRING';
const CONFIG: BackendConfigType = { gatewayUrl: environment.gatewayUrl };

// TODO: Cuando el backend de comentarios esté listo, usar commentProvider aquí
interface Providers {
  playerProvider: PlayerProviderInterface;
  teamProvider: TeamProviderInterface;
  commentProvider: CommentProviderInterface;
}
@Injectable({
  providedIn: 'root',
})
export class BackendManagerService {
  private http = inject(HttpClient);
  private context = new BackendContext(new NodeBackend(CONFIG, this.http));
  private _currentBackend = signal<BackenType>('NODE');
  private _providers = signal<Providers>(this.context.init());

  readonly currentBackend = this._currentBackend.asReadonly();
  readonly providers = this._providers.asReadonly();

  private _providers$ = toObservable(this._providers);

  readonly players = toSignal(
    this._providers$.pipe(
      switchMap((p) => p.playerProvider.getPlayers()),
    ),
    { initialValue: [] },
  );

  readonly teams = toSignal(
    this._providers$.pipe(
      switchMap((p) => p.teamProvider.getTeams()),
    ),
    { initialValue: [] },
  );

  toggleBackend() {
    this._currentBackend.update((v) => (v === 'NODE' ? 'SPRING' : 'NODE'));
    const factory =
      this._currentBackend() === 'NODE'
        ? new NodeBackend(CONFIG, this.http)
        : new SpringBackend(CONFIG, this.http);

    this.context.strategy = factory;
    this._providers.set(this.context.init());
  }
}
