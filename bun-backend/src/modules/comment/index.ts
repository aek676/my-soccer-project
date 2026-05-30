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
		},
	);
