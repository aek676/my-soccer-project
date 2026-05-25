import { PlayerProviderInterface } from '@core/providers/player-provider.interface';
import { TeamProviderInterface } from '@core/providers/team-provider.interface';
import { BackendConfigType } from '@core/types/backend-config.type';

export abstract class BackendFactory {
  constructor(protected config: BackendConfigType) {}
  public abstract createPlayerProvider(): PlayerProviderInterface;
  public abstract createTeamProvider(): TeamProviderInterface;
}
