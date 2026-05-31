import { Observable } from 'rxjs';
import { PlayerModel } from '@core/models/player.model';
import { TeamModel } from '@core/models/team.model';
import { BaseProvider } from '../base-provider';
import { TeamProviderInterface } from '../team-provider.interface';

export class NodeTeamProvider
  extends BaseProvider
  implements TeamProviderInterface
{
  generateIdealTeam(): Observable<PlayerModel[]> {
    return this.http.get<PlayerModel[]>(
      `${this.gatewayUrl}/bun-backend/ideal-team/generate`,
    );
  }

  saveIdealTeam(name: string, playerIds: string[]): Observable<TeamModel> {
    return this.http.post<TeamModel>(`${this.gatewayUrl}/bun-backend/ideal-team`, {
      name,
      players: playerIds,
    });
  }

  getUserTeams(): Observable<TeamModel[]> {
    return this.http.get<TeamModel[]>(
      `${this.gatewayUrl}/bun-backend/ideal-team`,
    );
  }
}

