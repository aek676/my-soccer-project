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
			detail: {
				summary: "Generate ideal team",
				description:
					"Use AI (Groq/Llama) to analyze all players in the database and select the best 11 to form an optimal football team with a realistic formation.",
				tags: ["Ideal Team"],
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
			detail: {
				summary: "Save an ideal team",
				description:
					"Save a user-created ideal team (with a name and exactly 11 player IDs) to the database. Requires authentication.",
				tags: ["Ideal Team"],
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
			detail: {
				summary: "Get user's saved teams",
				description:
					"Retrieve all ideal teams saved by the authenticated user.",
				tags: ["Ideal Team"],
			},
		},
	);
