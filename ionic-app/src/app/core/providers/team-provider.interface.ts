import { TeamModel } from '@core/models/team.model';

export interface TeamProviderInterface {
  getTeamById(teamId: string): TeamModel;
  getTeams(): TeamModel[];
}
