import { SpringPlayerProvider } from './spring-player-provider';
import { BackendConfigType } from '@core/types/backend-config.type';

describe('SpringPlayerProvider', () => {
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };

  it('should create an instance with config', () => {
    const provider = new SpringPlayerProvider(config);
    expect(provider).toBeTruthy();
  });

  it('should return mock players from getPlayers', () => {
    const provider = new SpringPlayerProvider(config);
    const players = provider.getPlayers();
    expect(players.length).toBeGreaterThan(0);
  });

  it('should find a player by id', () => {
    const provider = new SpringPlayerProvider(config);
    const player = provider.getPlayerById('101');
    expect(player).toBeDefined();
    expect(player.id).toBe('101');
  });

  it('should throw for unknown player id', () => {
    const provider = new SpringPlayerProvider(config);
    expect(() => provider.getPlayerById('unknown')).toThrow();
  });
});
