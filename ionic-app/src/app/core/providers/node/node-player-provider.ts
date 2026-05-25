import { PlayerModel } from '@core/models/player.model';
import { BaseProvider } from '../base-provider';
import { PlayerProviderInterface } from '../player-provider.interface';
import nodePlayers from '@core/mocks/nodePlayers.json';

export class NodePlayerProvider
  extends BaseProvider
  implements PlayerProviderInterface
{
  getPlayerById(playerId: string): PlayerModel {
    console.log(`Fetching ${this.gatewayUrl}/players-node/${playerId}`);
    const player = nodePlayers.find((p: PlayerModel) => p.id === playerId);
    if (!player) throw new Error(`Player with id ${playerId} not found`);
    return player;
  }

  getPlayers(): PlayerModel[] {
    console.log(`Fetching ${this.gatewayUrl}/players-node`);
    return nodePlayers;
  }
}
