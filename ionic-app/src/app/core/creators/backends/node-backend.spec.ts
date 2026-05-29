import { HttpClient } from '@angular/common/http';
import { NodeBackend } from './node-backend';
import { BackendConfigType } from '@core/types/backend-config.type';

describe('NodeBackend', () => {
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };
  const httpMock = {} as HttpClient;

  it('should create an instance with config', () => {
    const backend = new NodeBackend(config, httpMock);
    expect(backend).toBeTruthy();
  });

  it('should create a NodePlayerProvider', () => {
    const backend = new NodeBackend(config, httpMock);
    const provider = backend.createPlayerProvider();
    expect(provider).toBeDefined();
  });

  it('should create a team provider', () => {
    const backend = new NodeBackend(config, httpMock);
    const provider = backend.createTeamProvider();
    expect(provider).toBeDefined();
  });

  it('should create a comment provider (mock)', () => {
    const backend = new NodeBackend(config, httpMock);
    const provider = backend.createCommentProvider();
    expect(provider).toBeDefined();
  });
});
