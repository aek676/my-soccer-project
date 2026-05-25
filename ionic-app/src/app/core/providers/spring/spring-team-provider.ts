import { TeamModel } from '@core/models/team.model';
import { BaseProvider } from '../base-provider';
import { TeamProviderInterface } from '../team-provider.interface';

export class SpringTeamProvider
  extends BaseProvider
  implements TeamProviderInterface
{
  getTeamById(teamId: string): TeamModel {
    console.log(`Fetching ${this.gatewayUrl}/teams-spring/${teamId}`);
    throw new Error('Method not implemented.');
  }
  getTeams(): TeamModel[] {
    console.log(`Fetching ${this.gatewayUrl}/teams-spring`);
    throw new Error('Method not implemented.');
  }
}
