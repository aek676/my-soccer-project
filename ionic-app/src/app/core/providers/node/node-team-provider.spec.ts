import { NodeTeamProvider } from './node-team-provider';
import { BackendConfigType } from '@core/types/backend-config.type';

describe('NodeTeamProvider', () => {
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };

  it('should create an instance with config', () => {
    const provider = new NodeTeamProvider(config);
    expect(provider).toBeTruthy();
  });

  it('should throw on getTeamById (not implemented)', () => {
    const provider = new NodeTeamProvider(config);
    expect(() => provider.getTeamById('1')).toThrow();
  });

  it('should throw on getTeams (not implemented)', () => {
    const provider = new NodeTeamProvider(config);
    expect(() => provider.getTeams()).toThrow();
  });
});
