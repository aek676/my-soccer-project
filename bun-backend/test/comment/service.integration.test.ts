import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from "bun:test";
import mongoose from "mongoose";
import { Comment } from "../../src/models/comment";
import { Player } from "../../src/models/player";
import { CommentService } from "../../src/modules/comment/service";
import { mongoUrl } from "../setup";

const validPlayerId = "507f1f77bcf86cd799439011";
const _validCommentId = "507f1f77bcf86cd799439012";

describe("CommentService - Integration Tests", () => {
	beforeAll(async () => {
		await mongoose.connect(mongoUrl);
	}, 30000);

	afterAll(async () => {
		await mongoose.disconnect();
	});

	beforeEach(async () => {
		await Comment.deleteMany({});
		await Player.deleteMany({});
	});

	afterEach(async () => {
		await Comment.deleteMany({});
		await Player.deleteMany({});
	});

	describe("getCommentsByPlayerId", () => {
		test("returns comments for existing player", async () => {
			const player = await Player.create({
				_id: validPlayerId,
				name: "Lionel Messi",
			});

			const comment = await Comment.create({
				text: "Great player!",
				rating: 5,
				idPlayer: player._id,
				idUser: "user-1",
				author: "Fan",
			});

			const result = await CommentService.getCommentsByPlayerId(
				player._id.toString(),
			);

			const comments = result as unknown as Array<Record<string, unknown>>;
			expect(comments).toHaveLength(1);
			expect(comments[0].id).toBe(comment._id.toString());
			expect(comments[0].text).toBe("Great player!");
			expect(comments[0].idUser).toBe("user-1");
		});

		test("returns empty array when player has no comments", async () => {
			const player = await Player.create({
				_id: validPlayerId,
				name: "Lionel Messi",
			});

			const result = await CommentService.getCommentsByPlayerId(
				player._id.toString(),
			);

			expect(result).toEqual([]);
		});

		test("returns 404 when player does not exist", async () => {
			const result = await CommentService.getCommentsByPlayerId(
				"507f1f77bcf86cd799439099",
			);

			expect(result).toHaveProperty("code", 404);
			expect(
				(result as { response: { code: number; message: string } }).response,
			).toEqual({
				code: 404,
				message: "Player not found",
			});
		});
	});

	describe("createComment", () => {
		test("creates comment and returns 201", async () => {
			const player = await Player.create({
				_id: validPlayerId,
				name: "Lionel Messi",
			});

			const body = {
				text: "Amazing goal!",
				rating: 5,
				idPlayer: player._id.toString(),
			};

			const result = await CommentService.createComment(body, "user-1");
			const resultWithStatus = result as {
				code: number;
				response: {
					id: string;
					text: string;
					idUser: string;
					idPlayer: string;
				};
			};

			expect(resultWithStatus.code).toBe(201);
			expect(resultWithStatus.response.text).toBe("Amazing goal!");
			expect(resultWithStatus.response.idUser).toBe("user-1");
			expect(resultWithStatus.response.idPlayer).toBe(player._id.toString());

			const saved = await Comment.findById(resultWithStatus.response.id);
			expect(saved).not.toBeNull();
			expect(saved?.idUser).toBe("user-1");
		});

		test("returns 404 when player does not exist", async () => {
			const body = {
				text: "Amazing goal!",
				rating: 5,
				idPlayer: "507f1f77bcf86cd799439099",
			};

			const result = await CommentService.createComment(body, "user-1");

			expect(result).toHaveProperty("code", 404);
			expect(
				(result as { response: { code: number; message: string } }).response,
			).toEqual({
				code: 404,
				message: "Player not found",
			});
		});
	});

	describe("deleteComment", () => {
		test("deletes comment and returns 200", async () => {
			const player = await Player.create({
				_id: validPlayerId,
				name: "Lionel Messi",
			});

			const comment = await Comment.create({
				text: "To delete",
				rating: 3,
				idPlayer: player._id,
				idUser: "user-1",
			});

			const result = await CommentService.deleteComment(comment._id.toString());

			expect(result).toEqual({ code: 200, message: "Comment deleted" });

			const deleted = await Comment.findById(comment._id);
			expect(deleted).toBeNull();
		});

		test("returns 404 when comment does not exist", async () => {
			const result = await CommentService.deleteComment(
				"507f1f77bcf86cd799439099",
			);

			expect(result).toHaveProperty("code", 404);
			expect(
				(result as { response: { code: number; message: string } }).response,
			).toEqual({
				code: 404,
				message: "Comment not found",
			});
		});
	});
});
