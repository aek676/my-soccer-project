import { t } from "elysia";

const LocationSchema = t.Object({
	type: t.String(),
	coordinates: t.Array(t.Number()),
});

export const PlayerResponse = t.Object({
	_id: t.String(),
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
});

export const ErrorResponse = t.Object({
	code: t.Number(),
	message: t.String(),
});

export type PlayerResponseType = typeof PlayerResponse.static;
export type ErrorResponseType = typeof ErrorResponse.static;
