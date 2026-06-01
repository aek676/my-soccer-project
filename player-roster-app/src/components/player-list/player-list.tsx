import { Component, State, h } from '@stencil/core';
import { fetchPlayers, type Player } from '../../utils/player';

@Component({
  tag: 'player-list',
  styleUrl: 'player-list.css',
  shadow: true,
})
export class PlayerList {
  @State() players: Player[] = [];
  @State() loading = true;
  @State() error = '';

  private apiBase = 'http://localhost:8080/players-service';

  async componentWillLoad() {
    try {
      this.players = await fetchPlayers(this.apiBase);
    } catch (e: unknown) {
      this.error = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return <div class="status">Loading players...</div>;
    }
    if (this.error) {
      return <div class="status error">Error: {this.error}</div>;
    }
    if (this.players.length === 0) {
      return <div class="status">No players found.</div>;
    }
    return (
      <div class="grid">
        {this.players.map(p => (
          <div class="card">
            {p.photo && <img class="photo" src={p.photo} alt={p.name} />}
            <div class="info">
              <div class="name">{p.name}</div>
              {p.team && <div class="team">{p.team}</div>}
              {p.nationality && <div class="nationality">{p.nationality}</div>}
              {p.position && <div class="position">{p.position}</div>}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
