import { HttpClient } from '@angular/common/http';
import { BackendContext } from './backend-context';
import { BackendFactory } from '@core/creators/backends/backend-factory';
import { PlayerProviderInterface } from '@core/providers/player-provider.interface';
import { TeamProviderInterface } from '@core/providers/team-provider.interface';
import { BackendConfigType } from '@core/types/backend-config.type';

describe('BackendContext', () => {
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };
  const httpMock = {} as HttpClient;

  class MockFactory extends BackendFactory {
    createPlayerProvider(): PlayerProviderInterface {
      return {} as PlayerProviderInterface;
    }
    createTeamProvider(): TeamProviderInterface {
      return {} as TeamProviderInterface;
    }
  }

  it('should create an instance with a strategy', () => {
    const context = new BackendContext(new MockFactory(config, httpMock));
    expect(context).toBeTruthy();
  });

  it('should return providers from init()', () => {
    const context = new BackendContext(new MockFactory(config, httpMock));
    const providers = context.init();
    expect(providers.playerProvider).toBeDefined();
    expect(providers.teamProvider).toBeDefined();
  });

  it('should allow changing the strategy', () => {
    const context = new BackendContext(new MockFactory(config, httpMock));
    const newFactory = new MockFactory(config, httpMock);
    context.strategy = newFactory;
    expect(context.strategy).toBe(newFactory);
  });
});
