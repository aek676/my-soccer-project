import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	spyOn,
	test,
} from "bun:test";
import { Elysia } from "elysia";
import mongoose from "mongoose";
import { Player } from "../../src/models/player";
import { PlayerModule } from "../../src/modules/player";
import { mongoUrl } from "../setup";

const app = new Elysia().use(PlayerModule);

type FetchLike = (
	input: string | URL | Request,
	init?: RequestInit,
) => Promise<Response>;

interface FetchSpy {
	mockImplementation: (fn: FetchLike) => FetchSpy;
	mockRestore: () => void;
}

const spyOnFetch = (): FetchSpy =>
	spyOn(
		globalThis as unknown as { fetch: FetchLike },
		"fetch",
	) as unknown as FetchSpy;

const get = (url: string) => app.handle(new Request(`http://localhost${url}`));
const post = (url: string) =>
	app.handle(new Request(`http://localhost${url}`, { method: "POST" }));

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

	describe("POST /players/import/:apiPlayerId", () => {
		const mockPlayer = {
			id: 154,
			name: "Lionel Messi",
			firstname: "Lionel",
			lastname: "Messi",
			age: 37,
			birth: {
				date: "1987-06-24",
				place: "Rosario",
				country: "Argentina",
			},
			nationality: "Argentina",
			height: "169 cm",
			weight: "67 kg",
			injured: false,
			photo: "https://media.api-sports.io/football/players/154.png",
		};

		const mockStatEntry = {
			team: {
				id: 9568,
				name: "Inter Miami",
				logo: "https://media.api-sports.io/football/teams/9568.png",
			},
			league: {
				id: 253,
				name: "Major League Soccer",
				country: "USA",
				logo: "https://media.api-sports.io/football/leagues/253.png",
				flag: null,
				season: 2024,
			},
			games: {
				appearences: 22,
				lineups: 18,
				minutes: 1755,
				number: 10,
				position: "Attacker",
				rating: "8.32",
				captain: false,
			},
			goals: { total: 21, conceded: 0, assists: 11, saves: null },
		};

		let fetchSpy: FetchSpy;

		beforeAll(() => {
			Bun.env.API_KEY_API_FOOTBALL = "test-api-key";
		});

		afterAll(() => {
			Bun.env.API_KEY_API_FOOTBALL = undefined as unknown as string;
		});

		beforeEach(() => {
			fetchSpy = spyOnFetch().mockImplementation(
				async () =>
					new Response(
						JSON.stringify({
							response: [{ player: mockPlayer, statistics: [mockStatEntry] }],
						}),
						{ status: 200 },
					),
			);
		});

		afterEach(() => {
			fetchSpy?.mockRestore();
		});

		test("returns 201 and creates player when valid API player ID", async () => {
			const res = await post("/players/import/154");

			expect(res.status).toBe(201);
			const data = await res.json();
			expect(data.name).toBe("Lionel Messi");
			expect(data.firstName).toBe("Lionel");
			expect(data.lastName).toBe("Messi");
			expect(data.age).toBe(37);
			expect(data.nationality).toBe("Argentina");
			expect(data.height).toBe("169 cm");
			expect(data.weight).toBe("67 kg");
			expect(data.number).toBe(10);
			expect(data.position).toBe("Attacker");
			expect(data.photo).toBe(
				"https://media.api-sports.io/football/players/154.png",
			);
			expect(data.team).toBe("Inter Miami");
			expect(data.league).toBe("Major League Soccer");
			expect(data.externalId).toBe(154);
			expect(data).toHaveProperty("id");
			expect(data).not.toHaveProperty("_id");
		});

		test("returns 200 with existing player on duplicate import", async () => {
			await post("/players/import/154");
			const res = await post("/players/import/154");

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data.name).toBe("Lionel Messi");
			expect(data.externalId).toBe(154);
		});

		test("player is persisted in database after import", async () => {
			await post("/players/import/154");

			const dbPlayer = (await Player.findOne({ externalId: 154 }).lean()) as {
				name: string;
				team: string;
				league: string;
			} | null;
			expect(dbPlayer).not.toBeNull();
			expect(dbPlayer?.name).toBe("Lionel Messi");
			expect(dbPlayer?.team).toBe("Inter Miami");
			expect(dbPlayer?.league).toBe("Major League Soccer");
		});

		test("returns 404 when player not found in external API", async () => {
			fetchSpy.mockImplementation(
				async () =>
					new Response(JSON.stringify({ response: [] }), { status: 200 }),
			);

			const res = await post("/players/import/999999");

			expect(res.status).toBe(404);
			const data = await res.json();
			expect(data.code).toBe(404);
			expect(data.message).toBe("Player with external ID 999999 not found");
		});

		test("returns 500 when API key is missing", async () => {
			Bun.env.API_KEY_API_FOOTBALL = undefined as unknown as string;

			const res = await post("/players/import/154");

			expect(res.status).toBe(500);
			const data = await res.json();
			expect(data.code).toBe(500);

			Bun.env.API_KEY_API_FOOTBALL = "test-api-key";
		});

		test("returns 500 when external API call fails", async () => {
			fetchSpy.mockImplementation(
				async () => new Response("Server Error", { status: 500 }),
			);

			const res = await post("/players/import/154");

			expect(res.status).toBe(500);
			const data = await res.json();
			expect(data.code).toBe(500);
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
