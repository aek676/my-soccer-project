import { SpringBackend } from './spring-backend';
import { BackendConfigType } from '@core/types/backend-config.type';

describe('SpringBackend', () => {
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };

  it('should create an instance with config', () => {
    const backend = new SpringBackend(config);
    expect(backend).toBeTruthy();
  });

  it('should create a SpringPlayerProvider', () => {
    const backend = new SpringBackend(config);
    const provider = backend.createPlayerProvider();
    expect(provider).toBeDefined();
  });

  it('should create a team provider', () => {
    const backend = new SpringBackend(config);
    const provider = backend.createTeamProvider();
    expect(provider).toBeDefined();
  });
});
