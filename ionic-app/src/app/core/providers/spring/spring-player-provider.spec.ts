import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SpringPlayerProvider } from './spring-player-provider';
import { BackendConfigType } from '@core/types/backend-config.type';

describe('SpringPlayerProvider', () => {
  let provider: SpringPlayerProvider;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    provider = new SpringPlayerProvider(config, httpClient);
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

    const req = httpMock.expectOne('http://localhost:8080/players-spring');
    expect(req.request.method).toBe('GET');
    req.flush(mockPlayers);

    expect(players).toEqual(mockPlayers);
  });

  it('should fetch a player by id via GET', () => {
    const mockPlayer = {
      id: '101',
      name: 'Player 101',
      position: 'Midfielder',
      number: 8,
      age: 30,
    };

    let player: unknown;
    provider.getPlayerById('101').subscribe((p) => (player = p));

    const req = httpMock.expectOne('http://localhost:8080/players-spring/101');
    expect(req.request.method).toBe('GET');
    req.flush(mockPlayer);

    expect(player).toEqual(mockPlayer);
  });
});
