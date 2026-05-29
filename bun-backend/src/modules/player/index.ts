import { Elysia, t } from "elysia";
import { PlayerModel } from "./model";
import { PlayerService } from "./service";

export const PlayerModule = new Elysia({ name: "player" })
	.model({
		"player.createBody": PlayerModel.playerCreateBody,
		"player.importBody": PlayerModel.playerImportBody,
		"player.response": PlayerModel.playerResponse,
		"player.error": PlayerModel.errorResponse,
	})
	.get("/players", async () => await PlayerService.getAllPlayers(), {
		response: {
			200: t.Array(PlayerModel.playerResponse),
			500: "player.error",
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
		},
	);
