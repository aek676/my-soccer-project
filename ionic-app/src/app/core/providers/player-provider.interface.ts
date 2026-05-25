import { Observable } from 'rxjs';
import { PlayerModel } from '@core/models/player.model';

export interface PlayerProviderInterface {
  getPlayerById(playerId: string): Observable<PlayerModel>;
  getPlayers(): Observable<PlayerModel[]>;
}
