import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NodeTeamProvider } from './node-team-provider';
import { BackendConfigType } from '@core/types/backend-config.type';
import { PlayerModel } from '@core/models/player.model';
import { TeamModel } from '@core/models/team.model';

describe('NodeTeamProvider', () => {
  let provider: NodeTeamProvider;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
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

  describe('generateIdealTeam', () => {
    it('should call GET /bun-backend/ideal-team/generate', () => {
      const mockPlayers: PlayerModel[] = [
        { id: '1', name: 'Player 1', position: 'Goalkeeper' },
        { id: '2', name: 'Player 2', position: 'Defender' },
      ];

      let result: PlayerModel[] | undefined;
      provider.generateIdealTeam().subscribe((p) => (result = p));

      const req = httpMock.expectOne(
        'http://localhost:8080/bun-backend/ideal-team/generate',
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPlayers);

      expect(result).toEqual(mockPlayers);
    });
  });

  describe('saveIdealTeam', () => {
    it('should call POST /bun-backend/ideal-team with name and playerIds', () => {
      const mockTeam: TeamModel = {
        id: 'team1',
        name: 'My Team',
        players: [],
        created: '2024-01-01',
        idUser: 'user1',
      };

      let result: TeamModel | undefined;
      provider
        .saveIdealTeam('My Team', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'])
        .subscribe((t) => (result = t));

      const req = httpMock.expectOne(
        'http://localhost:8080/bun-backend/ideal-team',
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        name: 'My Team',
        players: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
      });
      req.flush(mockTeam);

      expect(result).toEqual(mockTeam);
    });
  });

  describe('getUserTeams', () => {
    it('should call GET /bun-backend/ideal-team', () => {
      const mockTeams: TeamModel[] = [
        {
          id: 'team1',
          name: 'Team One',
          players: [],
          created: '2024-01-01',
          idUser: 'user1',
        },
      ];

      let result: TeamModel[] | undefined;
      provider.getUserTeams().subscribe((t) => (result = t));

      const req = httpMock.expectOne(
        'http://localhost:8080/bun-backend/ideal-team',
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockTeams);

      expect(result).toEqual(mockTeams);
    });
  });
});