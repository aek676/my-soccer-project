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

  it('should fetch teams via GET', () => {
    const mockTeams = [
      { id: '1', name: 'Team A' },
      { id: '2', name: 'Team B' },
    ];

    let teams: unknown;
    provider.getTeams().subscribe((t) => (teams = t));

    const req = httpMock.expectOne('http://localhost:8080/teams-spring');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeams);

    expect(teams).toEqual(mockTeams);
  });

  it('should fetch a team by id via GET', () => {
    const mockTeam = { id: '1', name: 'Team A' };

    let team: unknown;
    provider.getTeamById('1').subscribe((t) => (team = t));

    const req = httpMock.expectOne('http://localhost:8080/teams-spring/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeam);

    expect(team).toEqual(mockTeam);
  });
});
