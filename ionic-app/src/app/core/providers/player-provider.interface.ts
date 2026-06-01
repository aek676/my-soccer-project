import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { PlayerModel } from '@core/models/player.model';

export interface PlayerProviderInterface {
  getPlayerById(playerId: string): Observable<PlayerModel>;
  getPlayers(): Observable<PlayerModel[]>;
  searchPlayers(name: string): Observable<PlayerModel[]>;
  createPlayer(player: Partial<PlayerModel>): Observable<PlayerModel>;
  updatePlayer(playerId: string, player: Partial<PlayerModel>): Observable<PlayerModel>;
  importPlayer(
    apiPlayerId: number,
    location: { type: 'Point'; coordinates: number[] },
  ): Observable<HttpResponse<PlayerModel>>;
  deletePlayer(playerId: string): Observable<HttpResponse<{ message: string }>>;
}
