import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NodePlayerProvider } from './node-player-provider';
import { BackendConfigType } from '@core/types/backend-config.type';

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
});
