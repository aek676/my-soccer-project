import { Component, Prop, State, Watch, h } from '@stencil/core';
import { fetchPlayerById, type Player } from '../../utils/player';

@Component({
  tag: 'player-detail',
  styleUrl: 'player-detail.css',
  shadow: true,
})
export class PlayerDetail {
  @Prop() playerId!: string;
  @State() player: Player | null = null;
  @State() loading = true;
  @State() error = '';

  private apiBase = 'http://localhost:8080/players-service';

  @Watch('playerId')
  async fetchData() {
    if (!this.playerId) return;
    this.loading = true;
    this.error = '';
    try {
      this.player = await fetchPlayerById(this.apiBase, this.playerId);
    } catch (e: unknown) {
      this.error = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      this.loading = false;
    }
  }

  async componentWillLoad() {
    await this.fetchData();
  }

  render() {
    if (this.loading) {
      return <div class="status">Loading player...</div>;
    }
    if (this.error) {
      return <div class="status error">Error: {this.error}</div>;
    }
    if (!this.player) {
      return <div class="status">Player not found.</div>;
    }

    const p = this.player;

    return (
      <div class="detail">
        <div class="photo-col">
          {p.photo && <img class="photo" src={p.photo} alt={p.name} />}
          <div class="number-badge">{p.number ?? '—'}</div>
        </div>
        <div class="info-col">
          <h1 class="name">{p.name}</h1>

          <div class="field-group">
            <LabelValue label="First Name" value={p.firstName} />
            <LabelValue label="Last Name" value={p.lastName} />
            <LabelValue label="Age" value={p.age != null ? String(p.age) : undefined} />
            <LabelValue label="Birthdate" value={p.birthdate ? new Date(p.birthdate).toLocaleDateString() : undefined} />
            <LabelValue label="Nationality" value={p.nationality} />
            <LabelValue label="Height" value={p.height} />
            <LabelValue label="Weight" value={p.weight} />
            <LabelValue label="Position" value={p.position} />
            <LabelValue label="Team" value={p.team} />
            <LabelValue label="League" value={p.league} />
          </div>
        </div>
      </div>
    );
  }
}

const LabelValue = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div class="field">
      <span class="label">{label}</span>
      <span class="value">{value}</span>
    </div>
  );
};
