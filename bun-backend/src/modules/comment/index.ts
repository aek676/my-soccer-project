import { Elysia, status, t } from "elysia";
import { authPlugin } from "../auth";
import { CommentModel } from "./model";
import { CommentService } from "./service";

export const CommentModule = new Elysia({ name: "comment" })
	.use(authPlugin)
	.model({
		"comment.createBody": CommentModel.createBody,
		"comment.response": CommentModel.response,
		"comment.error": CommentModel.errorResponse,
	})
	.get(
		"/comments",
		async ({ query: { playerId } }) =>
			await CommentService.getCommentsByPlayerId(playerId),
		{
			query: CommentModel.queryPlayerId,
			response: {
				200: t.Array(CommentModel.response),
				404: "comment.error",
				500: "comment.error",
			},
			detail: {
				summary: "Get comments by player",
				description:
					"Retrieve all comments and ratings for a specific football player by their MongoDB ObjectId.",
				tags: ["Comments"],
			},
		},
	)
	.post(
		"/comments",
		async ({ body, user }) => {
			if (!user.id) return status(401, { code: 401, message: "Unauthorized" });
			return CommentService.createComment(body, user.id);
		},
		{
			body: "comment.createBody",
			response: {
				201: "comment.response",
				401: "comment.error",
				404: "comment.error",
				500: "comment.error",
			},
			detail: {
				summary: "Create a new comment",
				description:
					"Add a comment with a rating (0-5) for a football player. Requires authentication via X-User-Id header.",
				tags: ["Comments"],
			},
		},
	)
	.delete(
		"/comments/:id",
		async ({ params: { id } }) => await CommentService.deleteComment(id),
		{
			params: t.Object({
				id: t.String({ pattern: "^[0-9a-fA-F]{24}$" }),
			}),
			response: {
				200: t.Object({
					code: t.Number(),
					message: t.String(),
				}),
				404: "comment.error",
				500: "comment.error",
			},
			detail: {
				summary: "Delete a comment",
				description: "Remove a comment by its MongoDB ObjectId.",
				tags: ["Comments"],
			},
		},
	);
