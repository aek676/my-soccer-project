import { status } from "elysia";
import { Player } from "../../models/player";
import type { ApiSportsPlayerEntry } from "../../types/football-api";
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

	static async createPlayer({
		name,
		firstName,
		lastName,
		age,
		birthdate,
		nationality,
		height,
		weight,
		number,
		team,
		league,
		position,
		photo,
	}: PlayerModel["playerCreateBody"]) {
		const playerDoc = await Player.create({
			name: name,
			firstName: firstName,
			lastName: lastName,
			age: age,
			birthdate: new Date(birthdate),
			nationality: nationality,
			height: height,
			weight: weight,
			number: number,
			team: team,
			league: league,
			position: position,
			photo: photo,
		});

		const obj = playerDoc.toObject();
		const { _id, ...rest } = obj;
		return status(201, {
			...rest,
			id: _id.toString(),
		} as PlayerModel["playerResponse"]);
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

		if (data.response?.length > 0) {
			const first = mapApiSportsPlayer(data.response[0]);
			console.log("[search] first player:", JSON.stringify(first, null, 2));
		}

		return data.response.map(mapApiSportsPlayer);
	}

	static async importPlayerFromApi(apiPlayerId: number) {
		const existing = await Player.findOne({
			externalId: apiPlayerId,
		}).lean();

		if (existing) {
			const { _id, ...rest } = existing;
			return { ...rest, id: _id.toString() } as PlayerModel["playerResponse"];
		}

		const apiKey = Bun.env.API_KEY_API_FOOTBALL;
		if (!apiKey)
			return status(500, { code: 500, message: "API key not configured" });

		const playersRes = await fetch(
			`https://v3.football.api-sports.io/players?id=${apiPlayerId}&season=2024`,
			{ headers: { "x-apisports-key": apiKey } },
		);

		if (!playersRes.ok) {
			const body = await playersRes.text();
			console.error(`[import] /players API error: ${body}`);
			return status(500, {
				code: 500,
				message: "Failed to fetch from external API",
			});
		}

		const playersData = await playersRes.json();

		if (!playersData.response?.length) {
			return status(404, {
				code: 404,
				message: `Player with external ID ${apiPlayerId} not found`,
			});
		}

		const entry = playersData.response[0] as ApiSportsPlayerEntry;
		let teamName: string | undefined;
		let leagueName: string | undefined;
		let playerNumber: number | undefined;
		let playerPosition: string | undefined;

		const stats = entry.statistics;
		if (stats?.length) {
			const best = stats.reduce((a, b) =>
				(a.games.appearences ?? 0) >= (b.games.appearences ?? 0) ? a : b,
			);
			teamName = best.team.name;
			leagueName = best.league.name;
			playerNumber = best.games.number ?? undefined;
			playerPosition = best.games.position ?? undefined;
		}

		const playerDoc = await Player.create({
			name: entry.player.name,
			firstName: entry.player.firstname ?? undefined,
			lastName: entry.player.lastname ?? undefined,
			age: entry.player.age ?? undefined,
			birthdate: entry.player.birth.date
				? new Date(entry.player.birth.date)
				: undefined,
			nationality: entry.player.nationality ?? undefined,
			height: entry.player.height ?? undefined,
			weight: entry.player.weight ?? undefined,
			number: playerNumber,
			position: playerPosition,
			photo: entry.player.photo ?? undefined,
			team: teamName,
			league: leagueName,
			externalId: apiPlayerId,
		});

		const obj = playerDoc.toObject();
		const { _id, ...rest } = obj;
		return status(201, {
			...rest,
			id: _id.toString(),
		} as PlayerModel["playerResponse"]);
	}
}
