import { HttpClient } from '@angular/common/http';
import { BaseProvider } from './base-provider';
import { BackendConfigType } from '@core/types/backend-config.type';

describe('BaseProvider', () => {
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };
  const httpMock = {} as HttpClient;

  class ConcreteProvider extends BaseProvider {
    testGatewayUrl(): string {
      return this.gatewayUrl;
    }
  }

  it('should expose gatewayUrl from config', () => {
    const provider = new ConcreteProvider(config, httpMock);
    expect(provider.testGatewayUrl()).toBe('http://localhost:8080');
  });
});
