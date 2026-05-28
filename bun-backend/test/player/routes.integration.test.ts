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
import { Player } from "../../src/models/player";
import { PlayerModule } from "../../src/modules/player";
import { mongoUrl } from "../setup";

const app = new Elysia().use(PlayerModule);

const get = (url: string) => app.handle(new Request(`http://localhost${url}`));

describe("PlayerModule Routes - Integration Tests", () => {
	beforeAll(async () => {
		await mongoose.connect(mongoUrl);
	}, 30000);

	afterAll(async () => {
		await mongoose.disconnect();
	});

	beforeEach(async () => {
		await Player.deleteMany({});
	});

	afterEach(async () => {
		await Player.deleteMany({});
	});

	describe("GET /players", () => {
		test("returns 200 with empty array", async () => {
			const res = await get("/players");

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toEqual([]);
		});

		test("returns 200 with array of players", async () => {
			await Player.create([
				{ name: "Lionel Messi", team: "Inter Miami" },
				{ name: "Kylian Mbappé", team: "Real Madrid" },
			]);

			const res = await get("/players");

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toHaveLength(2);
		});

		test("response body is an array", async () => {
			const res = await get("/players");

			const data = await res.json();
			expect(Array.isArray(data)).toBe(true);
		});

		test("players have id and name fields", async () => {
			await Player.create({ name: "Test Player", team: "Test Team" });

			const res = await get("/players");
			const data = await res.json();

			expect(data[0]).toHaveProperty("id");
			expect(data[0]).toHaveProperty("name");
			expect(data[0].name).toBe("Test Player");
		});
	});

	describe("GET /players/:id", () => {
		test("returns 200 with player when valid id", async () => {
			const player = await Player.create({
				name: "Vinícius Jr",
				team: "Real Madrid",
			});

			const res = await get(`/players/${player._id}`);

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data.name).toBe("Vinícius Jr");
			expect(data.team).toBe("Real Madrid");
		});

		test("returns error for invalid id format", async () => {
			const res = await get("/players/not-valid-id");

			expect(res.status).toBeGreaterThanOrEqual(400);
		});

		test("returns 404 for non-existent valid id", async () => {
			const validId = new mongoose.Types.ObjectId().toString();

			const res = await get(`/players/${validId}`);

			expect(res.status).toBe(404);
			const data = await res.json();
			expect(data.code).toBe(404);
			expect(data.message).toBe("Player not found");
		});

		test("response has id field instead of _id", async () => {
			const player = await Player.create({ name: "Test Player" });

			const res = await get(`/players/${player._id}`);
			const data = await res.json();

			expect(data).toHaveProperty("id");
			expect(data.id).toBe(player._id.toString());
			expect(data).not.toHaveProperty("_id");
			expect(data).not.toHaveProperty("__v");
		});

		test("error response has code and message", async () => {
			const validId = new mongoose.Types.ObjectId().toString();
			const res = await get(`/players/${validId}`);
			const data = await res.json();

			expect(data).toHaveProperty("code");
			expect(data).toHaveProperty("message");
			expect(typeof data.code).toBe("number");
			expect(typeof data.message).toBe("string");
		});
	});
});
