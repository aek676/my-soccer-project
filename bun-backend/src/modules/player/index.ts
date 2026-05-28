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
		"/players/:id",
		async ({ params: { id } }) => await PlayerService.getPlayerById(id),
		{
			params: t.Object({
				id: t.String(),
			}),
			response: {
				200: "player.response",
				404: "player.error",
				500: "player.error",
			},
		},
	);
