import { HttpClient, HttpResponse, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NodePlayerProvider } from './node-player-provider';
import { BackendConfigType } from '@core/types/backend-config.type';
import { PlayerModel } from '@core/models/player.model';

describe('NodePlayerProvider', () => {
  let provider: NodePlayerProvider;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    provider = new NodePlayerProvider(config, httpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an instance with config', () => {
    expect(provider).toBeTruthy();
  });

  it('should fetch players via GET', () => {
    const mockPlayers = [
      { id: '1', name: 'Player 1', position: 'Forward', number: 10, age: 25 },
      { id: '2', name: 'Player 2', position: 'Defender', number: 5, age: 28 },
    ];

    let players: unknown;
    provider.getPlayers().subscribe((p) => (players = p));

    const req = httpMock.expectOne('http://localhost:8080/bun-backend/players');
    expect(req.request.method).toBe('GET');
    req.flush(mockPlayers);

    expect(players).toEqual(mockPlayers);
  });

  it('should fetch a player by id via GET', () => {
    const mockPlayer = {
      id: '1',
      name: 'Player 1',
      position: 'Forward',
      number: 10,
      age: 25,
    };

    let player: unknown;
    provider.getPlayerById('1').subscribe((p) => (player = p));

    const req = httpMock.expectOne('http://localhost:8080/bun-backend/players/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPlayer);

    expect(player).toEqual(mockPlayer);
  });

  describe('searchPlayers', () => {
    it('should search players via GET with encoded name', () => {
      const mockPlayers: PlayerModel[] = [
        { id: '1', name: 'John Doe', position: 'Forward' },
      ];

      let result: PlayerModel[] | undefined;
      provider.searchPlayers('John Doe').subscribe((r) => (result = r));

      const req = httpMock.expectOne(
        'http://localhost:8080/bun-backend/players/search/John%20Doe',
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPlayers);

      expect(result).toEqual(mockPlayers);
    });
  });

  describe('createPlayer', () => {
    it('should POST a new player', () => {
      const newPlayer: Partial<PlayerModel> = { name: 'New Player', position: 'Midfielder' };
      const createdPlayer: PlayerModel = { id: '3', name: 'New Player', position: 'Midfielder' };

      let result: PlayerModel | undefined;
      provider.createPlayer(newPlayer).subscribe((r) => (result = r));

      const req = httpMock.expectOne('http://localhost:8080/bun-backend/players');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPlayer);
      req.flush(createdPlayer);

      expect(result).toEqual(createdPlayer);
    });
  });

  describe('updatePlayer', () => {
    it('should PATCH an existing player', () => {
      const update: Partial<PlayerModel> = { name: 'Updated Name' };
      const updatedPlayer: PlayerModel = { id: '1', name: 'Updated Name' };

      let result: PlayerModel | undefined;
      provider.updatePlayer('1', update).subscribe((r) => (result = r));

      const req = httpMock.expectOne('http://localhost:8080/bun-backend/players/1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(update);
      req.flush(updatedPlayer);

      expect(result).toEqual(updatedPlayer);
    });
  });

  describe('importPlayer', () => {
    it('should POST to import a player and return full response', () => {
      const location = { type: 'Point' as const, coordinates: [-3.7038, 40.4168] };
      const mockResponse = new HttpResponse({
        body: { id: 99, name: 'Imported Player' } as PlayerModel,
        status: 201,
      });

      let result: HttpResponse<PlayerModel> | undefined;
      provider
        .importPlayer(99, location)
        .subscribe((r) => (result = r));

      const req = httpMock.expectOne(
        'http://localhost:8080/bun-backend/players/import/99',
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ location });
      req.flush(mockResponse.body, { status: 201, statusText: 'Created' });

      expect(result?.status).toBe(201);
      expect(result?.body).toEqual(mockResponse.body);
    });
  });

  describe('deletePlayer', () => {
    it('should DELETE a player and return response', () => {
      let result: HttpResponse<{ message: string }> | undefined;
      provider.deletePlayer('1').subscribe((r) => (result = r));

      const req = httpMock.expectOne('http://localhost:8080/bun-backend/players/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Player deleted' }, { status: 200, statusText: 'OK' });

      expect(result?.status).toBe(200);
      expect(result?.body).toEqual({ message: 'Player deleted' });
    });
  });
});
