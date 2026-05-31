import { t, type UnwrapSchema } from "elysia";
import { PlayerModel } from "../player/model";

export const IdealTeamModel = {
	saveBody: t.Object({
		name: t.String({ minLength: 1, maxLength: 100 }),
		players: t.Array(t.String({ pattern: "^[0-9a-fA-F]{24}$" }), {
			minLength: 11,
			maxLength: 11,
		}),
	}),
	generateResponse: t.Array(PlayerModel.playerResponse),
	response: t.Object({
		id: t.String(),
		name: t.String(),
		players: t.Array(PlayerModel.playerResponse),
		created: t.Date(),
		idUser: t.String(),
	}),
	errorResponse: t.Object({
		code: t.Number(),
		message: t.String(),
	}),
} as const;

export type IdealTeamModel = {
	[k in keyof typeof IdealTeamModel]: UnwrapSchema<(typeof IdealTeamModel)[k]>;
};
