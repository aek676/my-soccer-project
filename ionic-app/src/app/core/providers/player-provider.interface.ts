import { PlayerModel } from '@core/models/player.model';

export interface PlayerProviderInterface {
  getPlayerById(playerId: string): PlayerModel;
  getPlayers(): PlayerModel[];
}
