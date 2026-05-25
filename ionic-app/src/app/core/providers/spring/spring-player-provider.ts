import { Observable } from 'rxjs';
import { PlayerModel } from '@core/models/player.model';
import { BaseProvider } from '../base-provider';
import { PlayerProviderInterface } from '../player-provider.interface';

export class SpringPlayerProvider
  extends BaseProvider
  implements PlayerProviderInterface
{
  getPlayerById(playerId: string): Observable<PlayerModel> {
    return this.http.get<PlayerModel>(
      `${this.gatewayUrl}/players-spring/${playerId}`,
    );
  }

  getPlayers(): Observable<PlayerModel[]> {
    return this.http.get<PlayerModel[]>(`${this.gatewayUrl}/players-spring`);
  }
}
