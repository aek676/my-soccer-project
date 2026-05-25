import { NodeBackend } from './node-backend';
import { BackendConfigType } from '@core/types/backend-config.type';

describe('NodeBackend', () => {
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };

  it('should create an instance with config', () => {
    const backend = new NodeBackend(config);
    expect(backend).toBeTruthy();
  });

  it('should create a NodePlayerProvider', () => {
    const backend = new NodeBackend(config);
    const provider = backend.createPlayerProvider();
    expect(provider).toBeDefined();
  });

  it('should create a team provider', () => {
    const backend = new NodeBackend(config);
    const provider = backend.createTeamProvider();
    expect(provider).toBeDefined();
  });
});
