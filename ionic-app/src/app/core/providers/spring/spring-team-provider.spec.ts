import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SpringTeamProvider } from './spring-team-provider';
import { BackendConfigType } from '@core/types/backend-config.type';
import { PlayerModel } from '@core/models/player.model';
import { TeamModel } from '@core/models/team.model';

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

  describe('generateIdealTeam', () => {
    it('should fetch generated team via GET', () => {
      const mockPlayers: PlayerModel[] = [
        { id: '1', name: 'Player 1', position: 'Forward', number: 10, age: 25 },
        { id: '2', name: 'Player 2', position: 'Defender', number: 5, age: 28 },
      ];

      let result: PlayerModel[] | undefined;
      provider.generateIdealTeam().subscribe((r) => (result = r));

      const req = httpMock.expectOne(
        'http://localhost:8080/ideal-team-service/ideal-team/generate',
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPlayers);

      expect(result).toEqual(mockPlayers);
    });
  });

  describe('saveIdealTeam', () => {
    it('should POST team and return created team', () => {
      const mockTeam: TeamModel = {
        id: 'team-1',
        name: 'Best XI',
        players: [],
        created: '2024-01-15T00:00:00',
        idUser: 'user-1',
      };

      let result: TeamModel | undefined;
      provider
        .saveIdealTeam('Best XI', ['1', '2', '3'])
        .subscribe((r) => (result = r));

      const req = httpMock.expectOne(
        'http://localhost:8080/ideal-team-service/ideal-team',
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        name: 'Best XI',
        players: ['1', '2', '3'],
      });
      req.flush(mockTeam);

      expect(result).toEqual(mockTeam);
    });
  });

  describe('getUserTeams', () => {
    it('should fetch user teams via GET', () => {
      const mockTeams: TeamModel[] = [
        {
          id: 'team-1',
          name: 'Best XI',
          players: [],
          created: '2024-01-15T00:00:00',
          idUser: 'user-1',
        },
      ];

      let result: TeamModel[] | undefined;
      provider.getUserTeams().subscribe((r) => (result = r));

      const req = httpMock.expectOne(
        'http://localhost:8080/ideal-team-service/ideal-team',
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockTeams);

      expect(result).toEqual(mockTeams);
    });
  });
});