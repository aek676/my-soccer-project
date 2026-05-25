import { PlayerModel } from '@core/models/player.model';
import { BaseProvider } from '../base-provider';
import { PlayerProviderInterface } from '../player-provider.interface';
import springPlayers from '@core/mocks/springPlayers.json';

export class SpringPlayerProvider
  extends BaseProvider
  implements PlayerProviderInterface
{
  getPlayerById(playerId: string): PlayerModel {
    console.log(`Fetching ${this.gatewayUrl}/players-spring/${playerId}`);
    const player = springPlayers.find((p: PlayerModel) => p.id === playerId);
    if (!player) throw new Error(`Player with id ${playerId} not found`);
    return player;
  }

  getPlayers(): PlayerModel[] {
    console.log(`Fetching ${this.gatewayUrl}/players-spring`);
    return springPlayers;
  }
}
