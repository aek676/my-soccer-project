import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from "bun:test";
import { Elysia } from "elysia";
import mongoose from "mongoose";
import { Comment } from "../../src/models/comment";
import { Player } from "../../src/models/player";
import { authPlugin } from "../../src/modules/auth";
import { CommentModule } from "../../src/modules/comment";
import { mongoUrl } from "../setup";

const app = new Elysia().use(authPlugin).use(CommentModule);

const validPlayerId = "507f1f77bcf86cd799439011";
const validCommentId = "507f1f77bcf86cd799439012";

const get = (url: string, headers?: Record<string, string>) =>
	app.handle(new Request(`http://localhost${url}`, { headers: headers ?? {} }));

const post = (url: string, body: unknown, headers?: Record<string, string>) =>
	app.handle(
		new Request(`http://localhost${url}`, {
			method: "POST",
			headers: { "Content-Type": "application/json", ...headers },
			body: JSON.stringify(body),
		}),
	);

const del = (url: string) =>
	app.handle(new Request(`http://localhost${url}`, { method: "DELETE" }));

describe("CommentModule - Routes Integration Tests", () => {
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

	describe("GET /comments", () => {
		test("returns comments for player with comments", async () => {
			const player = await Player.create({
				_id: validPlayerId,
				name: "Lionel Messi",
			});

			await Comment.create({
				text: "Great player!",
				rating: 5,
				idPlayer: player._id,
				idUser: "user-1",
				author: "Fan",
			});

			const res = await get(`/comments?playerId=${player._id}`);

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toHaveLength(1);
			expect(data[0].text).toBe("Great player!");
			expect(data[0].idUser).toBe("user-1");
		});

		test("returns empty array for player with no comments", async () => {
			const player = await Player.create({
				_id: validPlayerId,
				name: "Lionel Messi",
			});

			const res = await get(`/comments?playerId=${player._id}`);

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toEqual([]);
		});

		test("returns 404 for non-existent player", async () => {
			const res = await get("/comments?playerId=507f1f77bcf86cd799439099");

			expect(res.status).toBe(404);
			const data = await res.json();
			expect(data.code).toBe(404);
			expect(data.message).toBe("Player not found");
		});

		test("returns 422 when playerId is missing", async () => {
			const res = await get("/comments");

			expect(res.status).toBe(422);
		});

		test("returns 422 when playerId has invalid format", async () => {
			const res = await get("/comments?playerId=invalid-id");

			expect(res.status).toBe(422);
		});
	});

	describe("POST /comments", () => {
		test("creates comment with auth headers and returns 201", async () => {
			const player = await Player.create({
				_id: validPlayerId,
				name: "Lionel Messi",
			});

			const res = await post(
				"/comments",
				{
					text: "Amazing goal!",
					rating: 5,
					idPlayer: player._id.toString(),
				},
				{ "x-user-id": "user-123" },
			);

			expect(res.status).toBe(201);
			const data = await res.json();
			expect(data.text).toBe("Amazing goal!");
			expect(data.idUser).toBe("user-123");
			expect(data.idPlayer).toBe(player._id.toString());

			const saved = await Comment.findById(data.id);
			expect(saved).not.toBeNull();
			expect(saved?.idUser).toBe("user-123");
		});

		test("returns 401 when no auth headers", async () => {
			const player = await Player.create({
				_id: validPlayerId,
				name: "Lionel Messi",
			});

			const res = await post("/comments", {
				text: "Amazing goal!",
				rating: 5,
				idPlayer: player._id.toString(),
			});

			expect(res.status).toBe(401);
			const data = await res.json();
			expect(data.code).toBe(401);
			expect(data.message).toBe("Unauthorized");
		});

		test("returns 404 when player does not exist", async () => {
			const res = await post(
				"/comments",
				{
					text: "Amazing goal!",
					rating: 5,
					idPlayer: "507f1f77bcf86cd799439099",
				},
				{ "x-user-id": "user-123" },
			);

			expect(res.status).toBe(404);
			const data = await res.json();
			expect(data.code).toBe(404);
			expect(data.message).toBe("Player not found");
		});

		test("returns 422 when body is invalid", async () => {
			const res = await post(
				"/comments",
				{
					text: "Missing rating and idPlayer",
				},
				{ "x-user-id": "user-123" },
			);

			expect(res.status).toBe(422);
		});

		test("returns 422 when rating is out of range", async () => {
			const player = await Player.create({
				_id: validPlayerId,
				name: "Lionel Messi",
			});

			const res = await post(
				"/comments",
				{
					text: "Out of range rating",
					rating: 10,
					idPlayer: player._id.toString(),
				},
				{ "x-user-id": "user-123" },
			);

			expect(res.status).toBe(422);
		});
	});

	describe("DELETE /comments/:id", () => {
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

			const res = await del(`/comments/${comment._id}`);

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data.code).toBe(200);
			expect(data.message).toBe("Comment deleted");

			const deleted = await Comment.findById(comment._id);
			expect(deleted).toBeNull();
		});

		test("returns 404 when comment does not exist", async () => {
			const res = await del(`/comments/${validCommentId}`);

			expect(res.status).toBe(404);
			const data = await res.json();
			expect(data.code).toBe(404);
			expect(data.message).toBe("Comment not found");
		});

		test("returns 422 when id format is invalid", async () => {
			const res = await del("/comments/invalid-id");

			expect(res.status).toBe(422);
		});
	});
});
