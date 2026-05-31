import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { PlayerModel } from '@core/models/player.model';

import { BackendManagerService } from './backend-manager.service';

describe('BackendManagerService', () => {
  let service: BackendManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(BackendManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addPlayerToCache', () => {
    it('should append a player to the players signal', (done) => {
      const player: PlayerModel = { id: '99', name: 'New Player' };
      service.addPlayerToCache(player);
      setTimeout(() => {
        const allPlayers = service.players();
        expect(allPlayers.some((p) => p.id === '99')).toBeTrue();
        done();
      });
    });
  });

  describe('toggleBackend', () => {
    it('should switch from NODE to SPRING', () => {
      expect(service.currentBackend()).toBe('NODE');
      service.toggleBackend();
      expect(service.currentBackend()).toBe('SPRING');
    });

    it('should switch from SPRING back to NODE', () => {
      service.toggleBackend();
      service.toggleBackend();
      expect(service.currentBackend()).toBe('NODE');
    });
  });
});
