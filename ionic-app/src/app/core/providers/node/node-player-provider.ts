import { Observable } from 'rxjs';
import { PlayerModel } from '@core/models/player.model';
import { BaseProvider } from '../base-provider';
import { PlayerProviderInterface } from '../player-provider.interface';

// TODO: modify the endpoint to match the actual backend API for players
export class NodePlayerProvider
  extends BaseProvider
  implements PlayerProviderInterface
{
  getPlayerById(playerId: string): Observable<PlayerModel> {
    return this.http.get<PlayerModel>(
      `${this.gatewayUrl}/players-node/${playerId}`,
    );
  }

  getPlayers(): Observable<PlayerModel[]> {
    return this.http.get<PlayerModel[]>(
      `${this.gatewayUrl}/bun-backend/players`,
    );
  }
}
