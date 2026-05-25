import { TeamModel } from '@core/models/team.model';
import { BaseProvider } from '../base-provider';
import { TeamProviderInterface } from '../team-provider.interface';

export class NodeTeamProvider
  extends BaseProvider
  implements TeamProviderInterface
{
  getTeamById(teamId: string): TeamModel {
    console.log(`Fetching ${this.gatewayUrl}/teams-node/${teamId}`);
    throw new Error('Method not implemented.');
  }
  getTeam(): TeamModel[] {
    console.log(`Fetching ${this.gatewayUrl}/teams-node`);
    throw new Error('Method not implemented.');
  }
}
