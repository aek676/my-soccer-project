import { t, type UnwrapSchema } from "elysia";

const LocationSchema = t.Object({
	type: t.String(),
	coordinates: t.Array(t.Number()),
});

export const PlayerModel = {
	playerResponse: t.Object({
		id: t.String(),
		name: t.String(),
		firstName: t.Optional(t.String()),
		lastName: t.Optional(t.String()),
		age: t.Optional(t.Number()),
		birthdate: t.Optional(t.Date()),
		nationality: t.Optional(t.String()),
		height: t.Optional(t.String()),
		weight: t.Optional(t.String()),
		number: t.Optional(t.Number()),
		team: t.Optional(t.String()),
		league: t.Optional(t.String()),
		position: t.Optional(t.String()),
		photo: t.Optional(t.String()),
		location: t.Optional(LocationSchema),
		created: t.Optional(t.Date()),
	}),
	errorResponse: t.Object({
		code: t.Number(),
		message: t.String(),
	}),
} as const;

export type PlayerModel = {
	[k in keyof typeof PlayerModel]: UnwrapSchema<(typeof PlayerModel)[k]>;
};
