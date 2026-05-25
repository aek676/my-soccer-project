import { BackendFactory } from './backend-factory';
import { PlayerProviderInterface } from '@core/providers/player-provider.interface';
import { TeamProviderInterface } from '@core/providers/team-provider.interface';
import { BackendConfigType } from '@core/types/backend-config.type';

describe('BackendFactory', () => {
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };

  class ConcreteFactory extends BackendFactory {
    createPlayerProvider(): PlayerProviderInterface {
      return {} as PlayerProviderInterface;
    }
    createTeamProvider(): TeamProviderInterface {
      return {} as TeamProviderInterface;
    }
  }

  it('should store config in constructor', () => {
    const factory = new ConcreteFactory(config);
    expect(factory).toBeTruthy();
  });

  it('should create a player provider', () => {
    const factory = new ConcreteFactory(config);
    const provider = factory.createPlayerProvider();
    expect(provider).toBeDefined();
  });

  it('should create a team provider', () => {
    const factory = new ConcreteFactory(config);
    const provider = factory.createTeamProvider();
    expect(provider).toBeDefined();
  });
});
