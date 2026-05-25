import { BackendConfigType } from '@core/types/backend-config.type';

export abstract class BaseProvider {
  constructor(private config: BackendConfigType) {}

  protected get gatewayUrl(): string {
    return this.config.gatewayUrl;
  }
}
