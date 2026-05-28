import { status } from "elysia";
import { Player } from "../../models/player";
import type { PlayerModel } from "./model";

export abstract class PlayerService {
	static async getAllPlayers() {
		const players = await Player.find({}).lean();
		return players.map((p) => {
			const { _id, __v, ...rest } = p;
			return { ...rest, id: _id.toString() } as PlayerModel["playerResponse"];
		});
	}

	static async getPlayerById(id: string) {
		const player = await Player.findById(id).lean();
		if (!player) return status(404, { code: 404, message: "Player not found" });
		const { _id, __v, ...rest } = player;
		return { ...rest, id: _id.toString() } as PlayerModel["playerResponse"];
	}
}
