import { TestBed } from '@angular/core/testing';

import { BackendConfigurationService } from './backend-configuration.service';

describe('BackendConfigurationService', () => {
  let service: BackendConfigurationService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to NODE when nothing in localStorage', () => {
    expect(service.backendState()).toBe('NODE');
  });

  it('should load from localStorage when valid value exists', () => {
    localStorage.setItem('selected_backend', 'SPRINGBOOT');
    const freshService = new BackendConfigurationService();
    expect(freshService.backendState()).toBe('SPRINGBOOT');
  });

  it('should fallback to NODE when localStorage has invalid value', () => {
    localStorage.setItem('selected_backend', 'INVALID');
    service = TestBed.inject(BackendConfigurationService);
    expect(service.backendState()).toBe('NODE');
  });

  it('should toggle from NODE to SPRINGBOOT', () => {
    service.toggleBackend();
    expect(service.backendState()).toBe('SPRINGBOOT');
  });

  it('should toggle from SPRINGBOOT back to NODE', () => {
    service.toggleBackend();
    service.toggleBackend();
    expect(service.backendState()).toBe('NODE');
  });

  it('should persist toggle to localStorage', () => {
    service.toggleBackend();
    expect(localStorage.getItem('selected_backend')).toBe('SPRINGBOOT');
  });
});
