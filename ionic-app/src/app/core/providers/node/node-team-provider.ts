import { Observable } from 'rxjs';
import { TeamModel } from '@core/models/team.model';
import { BaseProvider } from '../base-provider';
import { TeamProviderInterface } from '../team-provider.interface';

export class NodeTeamProvider
  extends BaseProvider
  implements TeamProviderInterface
{
  getTeamById(teamId: string): Observable<TeamModel> {
    return this.http.get<TeamModel>(
      `${this.gatewayUrl}/teams-node/${teamId}`,
    );
  }
  getTeams(): Observable<TeamModel[]> {
    return this.http.get<TeamModel[]>(`${this.gatewayUrl}/teams-node`);
  }
}
