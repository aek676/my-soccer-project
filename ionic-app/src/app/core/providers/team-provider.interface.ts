import { Observable } from 'rxjs';
import { PlayerModel } from '@core/models/player.model';
import { TeamModel } from '@core/models/team.model';

export interface TeamProviderInterface {
  generateIdealTeam(): Observable<PlayerModel[]>;
  saveIdealTeam(name: string, playerIds: string[]): Observable<TeamModel>;
  getUserTeams(): Observable<TeamModel[]>;
}
