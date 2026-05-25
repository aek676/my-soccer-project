import { BackendFactory } from '@core/creators/backends/backend-factory';

export class BackendContext {
  private _strategy: BackendFactory;

  constructor(strategy: BackendFactory) {
    this._strategy = strategy;
  }
  get strategy(): BackendFactory {
    return this._strategy;
  }

  set strategy(value: BackendFactory) {
    this._strategy = value;
  }

  public init() {
    return {
      playerProvider: this._strategy.createPlayerProvider(),
      teamProvider: this._strategy.createTeamProvider(),
    };
  }
}
