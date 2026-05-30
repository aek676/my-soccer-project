import { status } from "elysia";
import { Comment } from "../../models/comment";
import { Player } from "../../models/player";
import type { CommentModel } from "./model";

export abstract class CommentService {
	static async getCommentsByPlayerId(playerId: string) {
		const player = await Player.findById(playerId).lean();
		if (!player) return status(404, { code: 404, message: "Player not found" });
		const comments = await Comment.find({ idPlayer: playerId }).lean();
		return comments.map((c) => {
			const { _id, __v, idPlayer, ...rest } = c;
			return {
				...rest,
				id: _id.toString(),
				idPlayer: idPlayer.toString(),
			} as CommentModel["response"];
		});
	}

	static async createComment(body: CommentModel["createBody"], userId: string) {
		const player = await Player.findById(body.idPlayer).lean();
		if (!player) return status(404, { code: 404, message: "Player not found" });
		const commentDoc = await Comment.create({
			...body,
			idUser: userId,
		});
		const obj = commentDoc.toObject();
		const { _id, idPlayer, ...rest } = obj;
		return status(201, {
			...rest,
			id: _id.toString(),
			idPlayer: idPlayer.toString(),
		} as CommentModel["response"]);
	}

	static async deleteComment(id: string) {
		const deleted = await Comment.findByIdAndDelete(id);
		if (!deleted)
			return status(404, { code: 404, message: "Comment not found" });
		return { code: 200, message: "Comment deleted" };
	}
}
