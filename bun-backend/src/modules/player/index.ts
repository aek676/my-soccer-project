import { Elysia, t } from "elysia";
import { PlayerModel } from "./model";
import { PlayerService } from "./service";

export const PlayerModule = new Elysia({ name: "player" })
	.model({
		"player.createBody": PlayerModel.playerCreateBody,
		"player.updateBody": PlayerModel.playerUpdateBody,
		"player.importBody": PlayerModel.playerImportBody,
		"player.response": PlayerModel.playerResponse,
		"player.error": PlayerModel.errorResponse,
	})
	.get("/players", async () => await PlayerService.getAllPlayers(), {
		response: {
			200: t.Array(PlayerModel.playerResponse),
			500: "player.error",
		},
		detail: {
			summary: "List all players",
			description: "Retrieve all football players stored in the database.",
			tags: ["Players"],
		},
	})
	.get(
		"/players/search/:name",
		async ({ params: { name } }) =>
			await PlayerService.searchPlayerByName(name),
		{
			params: t.Object({
				name: t.String({ minLength: 1 }),
			}),
			response: {
				200: t.Array(PlayerModel.playerResponse),
				500: "player.error",
			},
			detail: {
				summary: "Search players by name",
				description:
					"Search football players by name using an external API (API-Football). Returns matched players with their details.",
				tags: ["Players"],
			},
		},
	)
	.get(
		"/players/:id",
		async ({ params: { id } }) => await PlayerService.getPlayerById(id),
		{
			params: t.Object({
				id: t.String({ pattern: "^[0-9a-fA-F]{24}$" }),
			}),
			response: {
				200: "player.response",
				400: "player.error",
				404: "player.error",
				500: "player.error",
			},
			detail: {
				summary: "Get player by ID",
				description:
					"Retrieve a single football player by their MongoDB ObjectId.",
				tags: ["Players"],
			},
		},
	)
	.post(
		"/players",
		async ({ body }) => await PlayerService.createPlayer(body),
		{
			body: "player.createBody",
			response: {
				201: "player.response",
				500: "player.error",
			},
			detail: {
				summary: "Create a new player",
				description: "Add a new football player to the database.",
				tags: ["Players"],
			},
		},
	)
	.post(
		"/players/import/:apiPlayerId",
		async ({ params: { apiPlayerId }, body }) =>
			await PlayerService.importPlayerFromApi(apiPlayerId, body),
		{
			params: t.Object({
				apiPlayerId: t.Number({ minimum: 1 }),
			}),
			body: "player.importBody",
			response: {
				200: "player.response",
				201: "player.response",
				404: "player.error",
				500: "player.error",
			},
			detail: {
				summary: "Import player from external API",
				description:
					"Import a football player from the API-Football external service by their external player ID. Stores player in MongoDB.",
				tags: ["Players"],
			},
		},
	)
	.patch(
		"/players/:id",
		async ({ params: { id }, body }) =>
			await PlayerService.updatePlayer(id, body),
		{
			params: t.Object({
				id: t.String({ pattern: "^[0-9a-fA-F]{24}$" }),
			}),
			body: "player.updateBody",
			response: {
				204: t.Undefined(),
				400: "player.error",
				404: "player.error",
				500: "player.error",
			},
			detail: {
				summary: "Update player",
				description:
					"Update an existing football player's information by their MongoDB ObjectId.",
				tags: ["Players"],
			},
		},
	)
	.delete(
		"/players/:id",
		async ({ params: { id } }) => await PlayerService.deletePlayer(id),
		{
			params: t.Object({
				id: t.String({ pattern: "^[0-9a-fA-F]{24}$" }),
			}),
			response: {
				200: t.Object({
					message: t.String(),
				}),
				404: "player.error",
				500: "player.error",
			},
			detail: {
				summary: "Delete player",
				description:
					"Remove a football player from the database by their MongoDB ObjectId.",
				tags: ["Players"],
			},
		},
	);
