import { Player } from "../../models/player";
import type { PlayerResponseType } from "./model";

export abstract class PlayerService {
	static async getAllPlayers(): Promise<PlayerResponseType[] | Error> {
		try {
			const players = await Player.find({}).lean();
			return players.map((p) => ({
				...p,
				id: p._id.toString(),
			})) as PlayerResponseType[];
		} catch (_error) {
			return new Error("Failed to fetch players");
		}
	}
}
