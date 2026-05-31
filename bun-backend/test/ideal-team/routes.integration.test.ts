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
import { IdealTeam } from "../../src/models/ideal-team";
import { Player } from "../../src/models/player";
import { authPlugin } from "../../src/modules/auth";
import { IdealTeamModule } from "../../src/modules/ideal-team";
import { mongoUrl } from "../setup";

const app = new Elysia().use(authPlugin).use(IdealTeamModule);

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

describe("IdealTeamModule - Routes Integration Tests", () => {
	beforeAll(async () => {
		await mongoose.connect(mongoUrl);
	}, 30000);

	afterAll(async () => {
		await mongoose.disconnect();
	});

	beforeEach(async () => {
		await IdealTeam.deleteMany({});
		await Player.deleteMany({});
	});

	afterEach(async () => {
		await IdealTeam.deleteMany({});
		await Player.deleteMany({});
	});

	describe("GET /ideal-team/generate", () => {
		test("returns 400 when fewer than 11 players", async () => {
			await Player.create({ name: "Only Player" });

			const res = await get("/ideal-team/generate");

			expect(res.status).toBe(400);
			const data = await res.json();
			expect(data.code).toBe(400);
			expect(data.message).toContain("Not enough players");
		});

		test("returns 500 when GROQ_API_KEY is missing", async () => {
			await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: "Midfielder",
				})),
			);

			const originalKey = Bun.env.GROQ_API_KEY;
			Bun.env.GROQ_API_KEY = undefined as unknown as string;

			const res = await get("/ideal-team/generate");

			expect(res.status).toBe(500);
			const data = await res.json();
			expect(data.code).toBe(500);

			Bun.env.GROQ_API_KEY = originalKey;
		});
	});

	describe("POST /ideal-team", () => {
		test("returns 401 without auth headers", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
				})),
			);
			const playerIds = players.map((p) => p._id.toString());

			const res = await post("/ideal-team", {
				name: "My Team",
				players: playerIds,
			});

			expect(res.status).toBe(401);
			const data = await res.json();
			expect(data.code).toBe(401);
			expect(data.message).toBe("Unauthorized");
		});

		test("returns 201 with valid body and auth", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: "Midfielder",
					team: "Test Team",
				})),
			);
			const playerIds = players.map((p) => p._id.toString());

			const res = await post(
				"/ideal-team",
				{ name: "My Team", players: playerIds },
				{ "x-user-id": "user-123" },
			);

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data.name).toBe("My Team");
			expect(data.players).toHaveLength(11);
			expect(data).toHaveProperty("id");
			expect(data.idUser).toBe("user-123");
		});

		test("returns 422 with invalid body (missing players)", async () => {
			const res = await post(
				"/ideal-team",
				{ name: "Bad Team" },
				{ "x-user-id": "user-123" },
			);

			expect(res.status).toBe(422);
		});

		test("returns 400 when players not found in database", async () => {
			const fakeIds = Array.from(
				{ length: 11 },
				(_, i) => `507f1f77bcf86cd79943${String(i).padStart(4, "0")}`,
			);

			const res = await post(
				"/ideal-team",
				{ name: "My Team", players: fakeIds },
				{ "x-user-id": "user-123" },
			);

			expect(res.status).toBe(400);
			const data = await res.json();
			expect(data.code).toBe(400);
			expect(data.message).toBe("One or more players not found");
		});

		test("returns 400 when players array has wrong length", async () => {
			const res = await post(
				"/ideal-team",
				{ name: "My Team", players: ["507f1f77bcf86cd799430001"] },
				{ "x-user-id": "user-123" },
			);

			expect(res.status).toBe(400);
		});

		test("response contains id field instead of _id", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: "Midfielder",
				})),
			);
			const playerIds = players.map((p) => p._id.toString());

			const res = await post(
				"/ideal-team",
				{ name: "My Team", players: playerIds },
				{ "x-user-id": "user-123" },
			);
			const data = await res.json();

			expect(data).toHaveProperty("id");
			expect(data).not.toHaveProperty("_id");
			expect(data).not.toHaveProperty("__v");
		});

		test("persists team to database", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: "Midfielder",
				})),
			);
			const playerIds = players.map((p) => p._id.toString());

			await post(
				"/ideal-team",
				{ name: "Persisted Team", players: playerIds },
				{ "x-user-id": "user-123" },
			);

			const dbTeam = await IdealTeam.findOne({ name: "Persisted Team" });
			expect(dbTeam).not.toBeNull();
			expect(dbTeam?.idUser).toBe("user-123");
			expect(dbTeam?.players).toHaveLength(11);
		});

		test("returns 422 when name is empty string", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
				})),
			);
			const playerIds = players.map((p) => p._id.toString());

			const res = await post(
				"/ideal-team",
				{ name: "", players: playerIds },
				{ "x-user-id": "user-123" },
			);

			expect(res.status).toBe(422);
		});
	});

	describe("GET /ideal-team", () => {
		test("returns 401 without auth headers", async () => {
			const res = await get("/ideal-team");

			expect(res.status).toBe(401);
			const data = await res.json();
			expect(data.code).toBe(401);
			expect(data.message).toBe("Unauthorized");
		});

		test("returns 200 with user's teams", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: "Midfielder",
					team: "Test",
				})),
			);

			await IdealTeam.create({
				name: "My Team",
				idUser: "user-1",
				players: players.map((p) => p._id),
			});

			const res = await get("/ideal-team", { "x-user-id": "user-1" });

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toHaveLength(1);
			expect(data[0].name).toBe("My Team");
			expect(data[0].players).toHaveLength(11);
		});

		test("returns 200 with empty array when no teams", async () => {
			const res = await get("/ideal-team", { "x-user-id": "user-1" });

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toEqual([]);
		});

		test("only returns teams for authenticated user", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: "Midfielder",
				})),
			);

			await IdealTeam.create({
				name: "User 1 Team",
				idUser: "user-1",
				players: players.map((p) => p._id),
			});
			await IdealTeam.create({
				name: "User 2 Team",
				idUser: "user-2",
				players: players.map((p) => p._id),
			});

			const res = await get("/ideal-team", { "x-user-id": "user-1" });

			const data = await res.json();
			expect(data).toHaveLength(1);
			expect(data[0].name).toBe("User 1 Team");
		});

		test("response has id field instead of _id", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: "Midfielder",
				})),
			);

			await IdealTeam.create({
				name: "My Team",
				idUser: "user-1",
				players: players.map((p) => p._id),
			});

			const res = await get("/ideal-team", { "x-user-id": "user-1" });
			const data = await res.json();

			expect(data[0]).toHaveProperty("id");
			expect(data[0]).not.toHaveProperty("_id");
			expect(data[0]).not.toHaveProperty("__v");
		});

		test("teams include populated player details", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: i === 0 ? "Goalkeeper" : "Midfielder",
					team: "Real Madrid",
				})),
			);

			await IdealTeam.create({
				name: "My Team",
				idUser: "user-1",
				players: players.map((p) => p._id),
			});

			const res = await get("/ideal-team", { "x-user-id": "user-1" });
			const data = await res.json();

			expect(data[0].players[0].name).toBe("Player 1");
			expect(data[0].players[0].position).toBe("Goalkeeper");
			expect(data[0].players[0].team).toBe("Real Madrid");
		});
	});
});
