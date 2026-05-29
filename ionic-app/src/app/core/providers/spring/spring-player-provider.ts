import { Observable, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { PlayerModel } from '@core/models/player.model';
import { BaseProvider } from '../base-provider';
import { PlayerProviderInterface } from '../player-provider.interface';

export class SpringPlayerProvider
  extends BaseProvider
  implements PlayerProviderInterface
{
  getPlayerById(playerId: string): Observable<PlayerModel> {
    return this.http.get<PlayerModel>(
      `${this.gatewayUrl}/players-service/players/${playerId}`,
    );
  }

  getPlayers(): Observable<PlayerModel[]> {
    return this.http.get<PlayerModel[]>(
      `${this.gatewayUrl}/players-service/players`,
    );
  }

  searchPlayers(_name: string): Observable<PlayerModel[]> {
    return throwError(() => new Error('Not implemented in Spring backend'));
  }

  importPlayer(
    _apiPlayerId: number,
    _location: { type: 'Point'; coordinates: number[] },
  ): Observable<HttpResponse<PlayerModel>> {
    return throwError(() => new Error('Not implemented in Spring backend'));
  }
}
