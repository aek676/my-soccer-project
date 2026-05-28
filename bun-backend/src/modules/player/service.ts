import { status } from "elysia";
import { Player } from "../../models/player";
import type { PlayerModel } from "./model";

export abstract class PlayerService {
  static async getAllPlayers() {
    try {
      const players = await Player.find({}).lean();
      return players.map((p) => {
        const { _id, __v, ...rest } = p;
        return { ...rest, id: _id.toString() } as PlayerModel["playerResponse"];
      });
    } catch {
      throw status(500, {
        code: 500,
        message: "Failed to fetch players",
      });
    }
  }

  static async getPlayerById(id: string) {
    try {
      const player = await Player.findById(id).lean();
      if (!player) {
        throw status(404, { code: 404, message: "Player not found" });
      }
      const { _id, __v, ...rest } = player;
      return { ...rest, id: _id.toString() } as PlayerModel["playerResponse"];
    } catch (error) {
      if (error instanceof Error && "code" in error) throw error;
      throw status(500, {
        code: 500,
        message: "Failed to fetch player",
      });
    }
  }
}
