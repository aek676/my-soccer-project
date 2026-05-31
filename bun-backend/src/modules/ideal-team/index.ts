import { Elysia, status, t } from "elysia";
import { authPlugin } from "../auth";
import { IdealTeamModel } from "./model";
import { IdealTeamService } from "./service";

export const IdealTeamModule = new Elysia({ name: "ideal-team" })
	.use(authPlugin)
	.model({
		"idealTeam.saveBody": IdealTeamModel.saveBody,
		"idealTeam.generateResponse": IdealTeamModel.generateResponse,
		"idealTeam.response": IdealTeamModel.response,
		"idealTeam.error": IdealTeamModel.errorResponse,
	})
	.get(
		"/ideal-team/generate",
		async () => await IdealTeamService.generateIdealTeam(),
		{
			response: {
				200: "idealTeam.generateResponse",
				400: "idealTeam.error",
				401: "idealTeam.error",
				500: "idealTeam.error",
			},
		},
	)
	.post(
		"/ideal-team",
		async ({ body, user }) => {
			if (!user.id) return status(401, { code: 401, message: "Unauthorized" });
			return IdealTeamService.saveIdealTeam(body, user.id);
		},
		{
			body: "idealTeam.saveBody",
			response: {
				201: "idealTeam.response",
				400: "idealTeam.error",
				401: "idealTeam.error",
				500: "idealTeam.error",
			},
		},
	)
	.get(
		"/ideal-team",
		async ({ user }) => {
			if (!user.id) return status(401, { code: 401, message: "Unauthorized" });
			return IdealTeamService.getUserTeams(user.id);
		},
		{
			response: {
				200: t.Array(IdealTeamModel.response),
				401: "idealTeam.error",
				500: "idealTeam.error",
			},
		},
	);
