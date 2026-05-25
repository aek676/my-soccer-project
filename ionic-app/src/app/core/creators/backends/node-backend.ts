import { PlayerProviderInterface } from '@core/providers/player-provider.interface';
import { TeamProviderInterface } from '@core/providers/team-provider.interface';
import { BackendFactory } from './backend-factory';
import { NodePlayerProvider } from '@core/providers/node/node-player-provider';
import { SpringTeamProvider } from '@core/providers/spring/spring-team-provider';

export class NodeBackend extends BackendFactory {
  public override createPlayerProvider(): PlayerProviderInterface {
    return new NodePlayerProvider(this.config);
  }
  public override createTeamProvider(): TeamProviderInterface {
    return new SpringTeamProvider(this.config);
  }
}
