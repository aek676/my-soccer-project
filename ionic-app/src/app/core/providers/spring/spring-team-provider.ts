import { Observable } from 'rxjs';
import { TeamModel } from '@core/models/team.model';
import { BaseProvider } from '../base-provider';
import { TeamProviderInterface } from '../team-provider.interface';

// TODO: modify the endpoint to match the actual backend API for teams
export class SpringTeamProvider
  extends BaseProvider
  implements TeamProviderInterface
{
  getTeamById(teamId: string): Observable<TeamModel> {
    return this.http.get<TeamModel>(
      `${this.gatewayUrl}/teams-spring/${teamId}`,
    );
  }
  getTeams(): Observable<TeamModel[]> {
    return this.http.get<TeamModel[]>(`${this.gatewayUrl}/teams-spring`);
  }
}
