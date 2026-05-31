import { Observable, throwError } from 'rxjs';
import { PlayerModel } from '@core/models/player.model';
import { TeamModel } from '@core/models/team.model';
import { BaseProvider } from '../base-provider';
import { TeamProviderInterface } from '../team-provider.interface';

export class NodeTeamProvider
  extends BaseProvider
  implements TeamProviderInterface
{
  generateIdealTeam(): Observable<PlayerModel[]> {
    // TODO: connect to bun-backend /ideal-team/generate
    return throwError(() => new Error('TODO: connect to bun-backend'));
  }

  saveIdealTeam(name: string, playerIds: string[]): Observable<TeamModel> {
    // TODO: connect to bun-backend /ideal-team
    return throwError(() => new Error('TODO: connect to bun-backend'));
  }

  getUserTeams(): Observable<TeamModel[]> {
    // TODO: connect to bun-backend /ideal-team
    return throwError(() => new Error('TODO: connect to bun-backend'));
  }
}

