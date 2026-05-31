import { Observable } from 'rxjs';
import { PlayerModel } from '@core/models/player.model';
import { TeamModel } from '@core/models/team.model';
import { BaseProvider } from '../base-provider';
import { TeamProviderInterface } from '../team-provider.interface';

export class SpringTeamProvider
  extends BaseProvider
  implements TeamProviderInterface
{
  generateIdealTeam(): Observable<PlayerModel[]> {
    return this.http.get<PlayerModel[]>(
      `${this.gatewayUrl}/ideal-team-service/ideal-team/generate`,
    );
  }

  saveIdealTeam(name: string, playerIds: string[]): Observable<TeamModel> {
    return this.http.post<TeamModel>(
      `${this.gatewayUrl}/ideal-team-service/ideal-team`,
      {
        name,
        players: playerIds,
      },
    );
  }

  getUserTeams(): Observable<TeamModel[]> {
    return this.http.get<TeamModel[]>(
      `${this.gatewayUrl}/ideal-team-service/ideal-team`,
    );
  }
}
