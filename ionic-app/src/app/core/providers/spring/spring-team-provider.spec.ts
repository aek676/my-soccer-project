import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SpringTeamProvider } from './spring-team-provider';
import { BackendConfigType } from '@core/types/backend-config.type';

describe('SpringTeamProvider', () => {
  let provider: SpringTeamProvider;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    provider = new SpringTeamProvider(config, httpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an instance with config', () => {
    expect(provider).toBeTruthy();
  });
});