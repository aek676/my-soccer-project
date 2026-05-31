import { PlayerModel } from './player.model';

export interface TeamModel {
  id: string;
  name: string;
  players: PlayerModel[];
  created: string;
  idUser: string;
}