import { Observable } from 'rxjs';
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

  searchPlayers(name: string): Observable<PlayerModel[]> {
    return this.http.get<PlayerModel[]>(
      `${this.gatewayUrl}/players-service/players/search/${encodeURIComponent(name)}`,
    );
  }

  createPlayer(player: Partial<PlayerModel>): Observable<PlayerModel> {
    return this.http.post<PlayerModel>(
      `${this.gatewayUrl}/players-service/players`,
      player,
    );
  }

  updatePlayer(playerId: string, player: Partial<PlayerModel>): Observable<PlayerModel> {
    return this.http.patch<PlayerModel>(
      `${this.gatewayUrl}/players-service/players/${playerId}`,
      player,
    );
  }

  importPlayer(
    apiPlayerId: number,
    location: { type: 'Point'; coordinates: number[] },
  ): Observable<HttpResponse<PlayerModel>> {
    return this.http.post<PlayerModel>(
      `${this.gatewayUrl}/players-service/players/import/${apiPlayerId}`,
      { location },
      { observe: 'response' },
    );
  }

  deletePlayer(playerId: string): Observable<HttpResponse<{ message: string }>> {
    return this.http.delete<{ message: string }>(
      `${this.gatewayUrl}/players-service/players/${playerId}`,
      { observe: 'response' },
    );
  }
}
