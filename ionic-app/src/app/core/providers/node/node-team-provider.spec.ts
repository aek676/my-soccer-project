import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NodeTeamProvider } from './node-team-provider';
import { BackendConfigType } from '@core/types/backend-config.type';

describe('NodeTeamProvider', () => {
  let provider: NodeTeamProvider;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    provider = new NodeTeamProvider(config, httpClient);
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

    const req = httpMock.expectOne('http://localhost:8080/teams-node');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeams);

    expect(teams).toEqual(mockTeams);
  });

  it('should fetch a team by id via GET', () => {
    const mockTeam = { id: '1', name: 'Team A' };

    let team: unknown;
    provider.getTeamById('1').subscribe((t) => (team = t));

    const req = httpMock.expectOne('http://localhost:8080/teams-node/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeam);

    expect(team).toEqual(mockTeam);
  });
});
