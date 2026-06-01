import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { PlayerModel } from '@core/models/player.model';
import { BaseProvider } from '../base-provider';
import { PlayerProviderInterface } from '../player-provider.interface';

export class NodePlayerProvider
  extends BaseProvider
  implements PlayerProviderInterface
{
  getPlayerById(playerId: string): Observable<PlayerModel> {
    return this.http.get<PlayerModel>(
      `${this.gatewayUrl}/bun-backend/players/${playerId}`,
    );
  }

  getPlayers(): Observable<PlayerModel[]> {
    return this.http.get<PlayerModel[]>(
      `${this.gatewayUrl}/bun-backend/players`,
    );
  }

  searchPlayers(name: string): Observable<PlayerModel[]> {
    return this.http.get<PlayerModel[]>(
      `${this.gatewayUrl}/bun-backend/players/search/${encodeURIComponent(name)}`,
    );
  }

  createPlayer(player: Partial<PlayerModel>): Observable<PlayerModel> {
    return this.http.post<PlayerModel>(
      `${this.gatewayUrl}/bun-backend/players`,
      player,
    );
  }

  updatePlayer(playerId: string, player: Partial<PlayerModel>): Observable<PlayerModel> {
    return this.http.patch<PlayerModel>(
      `${this.gatewayUrl}/bun-backend/players/${playerId}`,
      player,
    );
  }

  importPlayer(
    apiPlayerId: number,
    location: { type: 'Point'; coordinates: number[] },
  ): Observable<HttpResponse<PlayerModel>> {
    return this.http.post<PlayerModel>(
      `${this.gatewayUrl}/bun-backend/players/import/${apiPlayerId}`,
      { location },
      { observe: 'response' },
    );
  }

  deletePlayer(playerId: string): Observable<HttpResponse<{ message: string }>> {
    return this.http.delete<{ message: string }>(
      `${this.gatewayUrl}/bun-backend/players/${playerId}`,
      { observe: 'response' },
    );
  }
}
