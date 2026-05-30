import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, catchError } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import { BackendContext } from '@core/context/backend-context';
import { NodeBackend } from '@core/creators/backends/node-backend';
import { SpringBackend } from '@core/creators/backends/spring-backend';
import { CommentProviderInterface } from '@core/providers/comment-provider.interface';
import { PlayerProviderInterface } from '@core/providers/player-provider.interface';
import { TeamProviderInterface } from '@core/providers/team-provider.interface';
import { BackendConfigType } from '@core/types/backend-config.type';
import { PlayerModel } from '@core/models/player.model';
import { environment } from 'src/environments/environment';

export type BackendType = 'NODE' | 'SPRING';
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
  private _currentBackend = signal<BackendType>('NODE');
  private _providers = signal<Providers>(this.context.init());
  private _playersSubject = new BehaviorSubject<PlayerModel[]>([]);

  readonly currentBackend = this._currentBackend.asReadonly();
  readonly providers = this._providers.asReadonly();

  readonly players = toSignal(this._playersSubject, { initialValue: [] });

  readonly teams = toSignal(
    toObservable(this._providers).pipe(
      switchMap((p) =>
        p.teamProvider
          .getTeams()
          .pipe(catchError(() => of([] as PlayerModel[]))),
      ),
    ),
    { initialValue: [] },
  );

  constructor() {
    toObservable(this._providers)
      .pipe(
        switchMap((p) =>
          p.playerProvider
            .getPlayers()
            .pipe(catchError(() => of([] as PlayerModel[]))),
        ),
      )
      .subscribe((players) => this._playersSubject.next(players));
  }

  loadPlayers() {
    this._providers()
      .playerProvider.getPlayers()
      .pipe(catchError(() => of([] as PlayerModel[])))
      .subscribe((players) => this._playersSubject.next(players));
  }

  addPlayerToCache(player: PlayerModel) {
    this._playersSubject.next([...this._playersSubject.getValue(), player]);
  }

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
