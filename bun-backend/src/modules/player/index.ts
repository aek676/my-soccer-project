import { Elysia, t } from "elysia";
import { PlayerModel } from "./model";
import { PlayerService } from "./service";

export const PlayerModule = new Elysia({ name: "player" })
	.model({
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
		"/players/import/:apiPlayerId",
		async ({ params: { apiPlayerId } }) =>
			await PlayerService.importPlayerFromApi(apiPlayerId),
		{
			params: t.Object({
				apiPlayerId: t.Number({ minimum: 1 }),
			}),
			response: {
				200: "player.response",
				201: "player.response",
				404: "player.error",
				500: "player.error",
			},
		},
	);
