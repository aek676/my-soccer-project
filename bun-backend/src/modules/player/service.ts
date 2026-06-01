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

	static async createPlayer(body: PlayerModel["playerCreateBody"]) {
		const playerDoc = await Player.create({
			name: body.name,
			firstName: body.firstName,
			lastName: body.lastName,
			age: body.age,
			birthdate: new Date(body.birthdate),
			nationality: body.nationality,
			height: body.height,
			weight: body.weight,
			number: body.number,
			team: body.team,
			league: body.league,
			position: body.position,
			photo: body.photo,
			location: body.location,
		});

		const obj = playerDoc.toObject();
		const { _id, ...rest } = obj;
		return status(201, {
			...rest,
			id: _id.toString(),
		} as PlayerModel["playerResponse"]);
	}

	static async updatePlayer(id: string, body: PlayerModel["playerUpdateBody"]) {
		const existing = await Player.findById(id);
		if (!existing)
			return status(404, { code: 404, message: "Player not found" });

		if (body.name !== undefined) existing.name = body.name;
		if (body.firstName !== undefined) existing.firstName = body.firstName;
		if (body.lastName !== undefined) existing.lastName = body.lastName;
		if (body.age !== undefined) existing.age = body.age;
		if (body.birthdate !== undefined)
			existing.birthdate = new Date(body.birthdate);
		if (body.nationality !== undefined) existing.nationality = body.nationality;
		if (body.height !== undefined) existing.height = body.height;
		if (body.weight !== undefined) existing.weight = body.weight;
		if (body.number !== undefined) existing.number = body.number;
		if (body.team !== undefined) existing.team = body.team;
		if (body.league !== undefined) existing.league = body.league;
		if (body.position !== undefined) existing.position = body.position;
		if (body.photo !== undefined) existing.photo = body.photo;
		if (body.location !== undefined) existing.location = body.location;

		await existing.save();
		return status(204);
	}

	static async deletePlayer(id: string) {
		const deleted = await Player.findByIdAndDelete(id);
		if (!deleted)
			return status(404, { code: 404, message: "Player not found" });
		return { message: "Player deleted" };
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

	static async importPlayerFromApi(
		apiPlayerId: number,
		{ location }: PlayerModel["playerImportBody"],
	) {
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
			location: location,
		});

		const obj = playerDoc.toObject();
		const { _id, ...rest } = obj;
		return status(201, {
			...rest,
			id: _id.toString(),
		} as PlayerModel["playerResponse"]);
	}
}
