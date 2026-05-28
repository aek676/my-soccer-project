import { status } from "elysia";
import { Player } from "../../models/player";
import { mapApiSportsPlayer, type PlayerModel } from "./model";

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

	static async searchPlayerByName(name: string) {
		const apiKey = Bun.env.API_KEY_API_FOOTBALL;
		console.log(
			`[search] API key: ${apiKey ? `loaded (${apiKey.length} chars)` : "MISSING"}`,
		);
		if (!apiKey)
			return status(500, { code: 500, message: "API key not configured" });

		const response = await fetch(
			`https://v3.football.api-sports.io/players/profiles?search=${encodeURIComponent(name)}`,
			{ headers: { "x-apisports-key": apiKey } },
		);

		console.log(`[search] API status: ${response.status}`);
		if (!response.ok) {
			const body = await response.text();
			console.error(`[search] API error: ${body}`);
			return status(500, {
				code: 500,
				message: "Failed to fetch from external API",
			});
		}

		const data = await response.json();

		return data.response.map(mapApiSportsPlayer);
	}
}
