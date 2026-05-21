import { Injectable, signal } from '@angular/core';

export type BackendType = 'NODE' | 'SPRINGBOOT';

@Injectable({
  providedIn: 'root',
})
export class BackendConfigurationService {
  private readonly _backendState = signal<BackendType>(
    this.loadInitialBackend(),
  );

  private loadInitialBackend(): BackendType {
    return (localStorage.getItem('selected_backend') as BackendType) || 'NODE';
  }

  readonly backendState = this._backendState.asReadonly();

  /* istanbul ignore next */
  toggleBackend() {
    this._backendState.set(
      this._backendState() === 'NODE' ? 'SPRINGBOOT' : 'NODE',
    );
    localStorage.setItem('selected_backend', this._backendState());
    console.log('Backend is ' + this.backendState());
  }
}
