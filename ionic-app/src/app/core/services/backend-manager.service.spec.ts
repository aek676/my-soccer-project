import { TestBed } from '@angular/core/testing';

import { BackendManagerService } from './backend-manager.service';

describe('BackendManagerService', () => {
  let service: BackendManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
