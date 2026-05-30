import { t, type UnwrapSchema } from "elysia";

const LocationSchema = t.Object({
	type: t.Literal("Point"),
	coordinates: t.Array(t.Number()),
});

export const CommentModel = {
	createBody: t.Object({
		text: t.String({ maxLength: 1000 }),
		rating: t.Number({ minimum: 0, maximum: 5 }),
		author: t.Optional(t.String()),
		idPlayer: t.String({ pattern: "^[0-9a-fA-F]{24}$" }),
		location: t.Optional(LocationSchema),
	}),
	queryPlayerId: t.Object({
		playerId: t.String({ pattern: "^[0-9a-fA-F]{24}$" }),
	}),
	response: t.Object({
		id: t.String(),
		author: t.Optional(t.String()),
		text: t.String(),
		rating: t.Number(),
		created: t.Optional(t.Date()),
		idPlayer: t.String(),
		idUser: t.String(),
		location: t.Optional(LocationSchema),
	}),
	errorResponse: t.Object({
		code: t.Number(),
		message: t.String(),
	}),
} as const;

export type CommentModel = {
	[k in keyof typeof CommentModel]: UnwrapSchema<(typeof CommentModel)[k]>;
};
