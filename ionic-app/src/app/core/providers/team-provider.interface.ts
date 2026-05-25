import { Observable } from 'rxjs';
import { TeamModel } from '@core/models/team.model';

export interface TeamProviderInterface {
  getTeamById(teamId: string): Observable<TeamModel>;
  getTeams(): Observable<TeamModel[]>;
}
