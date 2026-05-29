import { t, type UnwrapSchema } from "elysia";
import type { ApiSportsPlayer } from "../../types/football-api";

const LocationSchema = t.Object({
	type: t.Literal("Point"),
	coordinates: t.Array(t.Number()),
});

export const PlayerModel = {
	playerCreateBody: t.Object({
		name: t.String(),
		firstName: t.String(),
		lastName: t.String(),
		age: t.Number(),
		birthdate: t.Date(),
		nationality: t.String(),
		height: t.String(),
		weight: t.String(),
		number: t.Number(),
		team: t.String(),
		league: t.String(),
		position: t.String(),
		photo: t.String(),
		location: LocationSchema,
	}),
	playerImportBody: t.Object({
		location: LocationSchema,
	}),
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
		externalId: t.Optional(t.Number()),
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

export function mapApiSportsPlayer(
	api: ApiSportsPlayer,
): PlayerModel["playerResponse"] {
	const { player } = api;
	return {
		id: player.id.toString(),
		name: player.name,
		firstName: player.firstname ?? undefined,
		lastName: player.lastname ?? undefined,
		age: player.age ?? undefined,
		birthdate: player.birth.date ? new Date(player.birth.date) : undefined,
		nationality: player.nationality ?? undefined,
		height: player.height ?? undefined,
		weight: player.weight ?? undefined,
		number: player.number ?? undefined,
		position: player.position ?? undefined,
		photo: player.photo ?? undefined,
		externalId: player.id,
	};
}
