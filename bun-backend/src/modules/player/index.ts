import { Elysia, status, t } from "elysia";
import { ErrorResponse, PlayerResponse } from "./model";
import { PlayerService } from "./service";

export const PlayerModule = new Elysia({ name: "player" })
	.model({
		"player.response": PlayerResponse,
		"player.error": ErrorResponse,
	})
	.get(
		"/players",
		async () => {
			const result = await PlayerService.getAllPlayers();
			if (result instanceof Error) {
				return status(500, { code: 500, message: result.message });
			}
			return result;
		},
		{
			response: {
				200: t.Array(PlayerResponse),
				500: "player.error",
			},
		},
	);
