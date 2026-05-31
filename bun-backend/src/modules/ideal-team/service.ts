import { createGroq } from "@ai-sdk/groq";
import { generateText, Output } from "ai";
import { status } from "elysia";
import type { Types } from "mongoose";
import { z } from "zod";
import { IdealTeam } from "../../models/ideal-team";
import { Player } from "../../models/player";
import type { PlayerModel } from "../player/model";
import type { IdealTeamModel } from "./model";

const groq = createGroq({
	apiKey: Bun.env.GROQ_API_KEY,
});

type PlayerDoc = Player & { _id: Types.ObjectId };

function mapPlayerDocument(p: PlayerDoc): PlayerModel["playerResponse"] {
	return {
		id: p._id.toString(),
		name: p.name,
		firstName: p.firstName ?? undefined,
		lastName: p.lastName ?? undefined,
		age: p.age ?? undefined,
		birthdate: p.birthdate ?? undefined,
		nationality: p.nationality ?? undefined,
		height: p.height ?? undefined,
		weight: p.weight ?? undefined,
		number: p.number ?? undefined,
		team: p.team ?? undefined,
		league: p.league ?? undefined,
		position: p.position ?? undefined,
		photo: p.photo ?? undefined,
		externalId: p.externalId ?? undefined,
		created: p.created ?? undefined,
	};
}

export abstract class IdealTeamService {
	static async generateIdealTeam() {
		const players = await Player.find({}).lean();

		if (players.length < 11) {
			return status(400, {
				code: 400,
				message: `Not enough players in database. Found ${players.length}, need at least 11.`,
			});
		}

		const groqApiKey = Bun.env.GROQ_API_KEY;
		if (!groqApiKey) {
			return status(500, {
				code: 500,
				message: "GROQ_API_KEY not configured",
			});
		}

		const playersContext = players
			.map(
				(p, i) =>
					`${i + 1}. ${p.name} | Position: ${p.position ?? "Unknown"} | Team: ${p.team ?? "Unknown"} | Age: ${p.age ?? "Unknown"} | Nationality: ${p.nationality ?? "Unknown"}`,
			)
			.join("\n");

		const { output } = await generateText({
			model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
			output: Output.object({
				name: "IdealTeamSelection",
				description:
					"Selection of exactly 11 football players to form an ideal team",
				schema: z.object({
					selectedIndices: z
						.array(z.number())
						.length(11)
						.describe(
							"Exactly 11 player indices (1-based) from the provided list. Must form a realistic football formation.",
						),
				}),
			}),
			prompt: `You are a world-class football expert. Given the following list of players, select the best 11 players to form an ideal team.

Rules:
- You MUST select exactly 11 players
- You MUST form a realistic football formation (e.g., 4-3-3, 4-4-2, 3-5-2)
- You MUST include exactly 1 goalkeeper
- You MUST include a balanced mix of defenders, midfielders, and forwards
- Use the player numbers (indices) provided in the list below

Players:
${playersContext}

Respond ONLY with a JSON object containing an array of exactly 11 unique player indices (numbers from 1 to ${players.length}) from the list above.
Example: {"selectedIndices": [3, 7, 12, 15, 20, 25, 30, 35, 40, 45, 50]}`,
		});

		const selectedPlayers = output.selectedIndices
			.map((idx) => players[idx - 1])
			.filter(Boolean)
			.map(mapPlayerDocument);

		return selectedPlayers;
	}

	static async saveIdealTeam(
		{ name, players }: IdealTeamModel["saveBody"],
		userId: string,
	) {
		if (players.length !== 11) {
			return status(400, {
				code: 400,
				message: "Team must have exactly 11 players",
			});
		}

		const existingPlayers = await Player.find({
			_id: { $in: players },
		}).lean();

		if (existingPlayers.length !== 11) {
			return status(400, {
				code: 400,
				message: "One or more players not found",
			});
		}

		const teamDoc = await IdealTeam.create({
			name,
			players,
			idUser: userId,
		});

		const populatedTeam = await IdealTeam.findById(teamDoc._id)
			.populate<{ players: PlayerDoc[] }>("players")
			.lean();

		if (!populatedTeam) {
			return status(500, {
				code: 500,
				message: "Failed to retrieve saved team",
			});
		}

		const { _id, ...rest } = populatedTeam;
		const playersWithId = populatedTeam.players.map(mapPlayerDocument);

		return {
			id: _id.toString(),
			...rest,
			players: playersWithId,
		};
	}

	static async getUserTeams(userId: string) {
		const teams = await IdealTeam.find({ idUser: userId })
			.populate<{ players: PlayerDoc[] }>("players")
			.lean();

		return status(
			200,
			teams.map((t) => {
				const { _id, __v, ...rest } = t;
				const playersWithId = t.players.map(mapPlayerDocument);
				return {
					id: _id.toString(),
					...rest,
					players: playersWithId,
				};
			}),
		);
	}
}
