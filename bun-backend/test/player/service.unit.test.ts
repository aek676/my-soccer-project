import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	spyOn,
	test,
} from "bun:test";
import { Player } from "../../src/models/player";
import { PlayerService } from "../../src/modules/player/service";

type MongooseQuery = ReturnType<typeof Player.find>;
type MongooseFindByIdQuery = ReturnType<typeof Player.findById>;
type MongooseFindOneQuery = ReturnType<typeof Player.findOne>;

const mockFind = <T>(data: T): MongooseQuery =>
	({ lean: () => Promise.resolve(data) }) as unknown as MongooseQuery;

const mockFindById = <T>(data: T): MongooseFindByIdQuery =>
	({ lean: () => Promise.resolve(data) }) as unknown as MongooseFindByIdQuery;

const mockFindOne = <T>(data: T | null): MongooseFindOneQuery =>
	({ lean: () => Promise.resolve(data) }) as unknown as MongooseFindOneQuery;

const makeDoc = (data: Record<string, unknown>, id: string) => ({
	_id: { toString: () => id },
	toObject: () => ({ ...data, _id: { toString: () => id } }),
});

type FetchLike = (
	input: string | URL | Request,
	init?: RequestInit,
) => Promise<Response>;

interface FetchSpy {
	mockImplementation: (fn: FetchLike) => FetchSpy;
	mockRestore: () => void;
	toHaveBeenCalled: () => void;
	toHaveBeenCalledTimes: (n: number) => void;
}

const spyOnFetch = (): FetchSpy =>
	spyOn(
		globalThis as unknown as { fetch: FetchLike },
		"fetch",
	) as unknown as FetchSpy;

describe("PlayerService - Unit Tests", () => {
	afterEach(() => {
		spyOn(Player, "find").mockRestore();
		spyOn(Player, "findById").mockRestore();
	});

	describe("getAllPlayers", () => {
		test("calls Player.find with empty filter", async () => {
			const findSpy = spyOn(Player, "find").mockReturnValue(mockFind([]));

			await PlayerService.getAllPlayers();

			expect(findSpy).toHaveBeenCalledWith({});
		});

		test("returns empty array when no players exist", async () => {
			spyOn(Player, "find").mockReturnValue(mockFind([]));

			const result = await PlayerService.getAllPlayers();

			expect(result).toEqual([]);
		});

		test("transforms _id to id and removes __v", async () => {
			const mockPlayer = {
				_id: { toString: () => "abc123def456abc123def4" },
				__v: 0,
				name: "Lionel Messi",
				team: "Inter Miami",
			};
			spyOn(Player, "find").mockReturnValue(mockFind([mockPlayer]));

			const result = await PlayerService.getAllPlayers();

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				id: "abc123def456abc123def4",
				name: "Lionel Messi",
				team: "Inter Miami",
			});
			expect(result[0]).not.toHaveProperty("_id");
			expect(result[0]).not.toHaveProperty("__v");
		});

		test("returns multiple players", async () => {
			const mockPlayers = [
				{
					_id: { toString: () => "aaa111bbb222ccc333ddd" },
					__v: 0,
					name: "Player One",
				},
				{
					_id: { toString: () => "ddd444eee555fff666ggg" },
					__v: 0,
					name: "Player Two",
				},
				{
					_id: { toString: () => "ggg777hhh888iii999jjj" },
					__v: 0,
					name: "Player Three",
				},
			];
			spyOn(Player, "find").mockReturnValue(mockFind(mockPlayers));

			const result = await PlayerService.getAllPlayers();

			expect(result).toHaveLength(3);
			expect(result.map((p) => p.id)).toEqual([
				"aaa111bbb222ccc333ddd",
				"ddd444eee555fff666ggg",
				"ggg777hhh888iii999jjj",
			]);
		});
	});

	describe("getPlayerById", () => {
		test("calls Player.findById with the given id", async () => {
			const validId = "507f1f77bcf86cd799439011";
			const findByIdSpy = spyOn(Player, "findById").mockReturnValue(
				mockFindById(null),
			);

			await PlayerService.getPlayerById(validId);

			expect(findByIdSpy).toHaveBeenCalledWith(validId);
		});

		test("returns 404 status response when player not found", async () => {
			const validId = "507f1f77bcf86cd799439011";
			spyOn(Player, "findById").mockReturnValue(mockFindById(null));

			const result = await PlayerService.getPlayerById(validId);

			expect(result).toHaveProperty("code", 404);
			expect(result).toHaveProperty("response");
			expect(
				(result as { response: { code: number; message: string } }).response,
			).toEqual({
				code: 404,
				message: "Player not found",
			});
		});

		test("returns player with id field when found", async () => {
			const validId = "507f1f77bcf86cd799439011";
			const mockPlayer = {
				_id: { toString: () => validId },
				__v: 0,
				name: "Kylian Mbappé",
				team: "Real Madrid",
				position: "Forward",
			};
			spyOn(Player, "findById").mockReturnValue(mockFindById(mockPlayer));

			const result = await PlayerService.getPlayerById(validId);

			expect(result).toEqual({
				id: validId,
				name: "Kylian Mbappé",
				team: "Real Madrid",
				position: "Forward",
				created: undefined,
			});
			expect(result).not.toHaveProperty("_id");
			expect(result).not.toHaveProperty("__v");
		});
	});

	describe("importPlayerFromApi", () => {
		const mockPlayer = {
			id: 154,
			name: "Lionel Messi",
			firstname: "Lionel",
			lastname: "Messi",
			age: 37,
			birth: { date: "1987-06-24", place: "Rosario", country: "Argentina" },
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

		afterEach(() => {
			fetchSpy?.mockRestore();
			spyOn(Player, "findOne").mockRestore();
			spyOn(Player, "create").mockRestore();
		});

		test("returns 200 with existing player when duplicate", async () => {
			const existing = {
				_id: { toString: () => "existingId" },
				name: "Lionel Messi",
				externalId: 154,
			};
			spyOn(Player, "findOne").mockReturnValue(mockFindOne(existing));

			const result = await PlayerService.importPlayerFromApi(154);

			expect(result).not.toHaveProperty("code");
			expect(result).toHaveProperty("id", "existingId");
			expect(result).toHaveProperty("name", "Lionel Messi");
		});

		test("returns 500 when API key is missing", async () => {
			spyOn(Player, "findOne").mockReturnValue(mockFindOne(null));
			Bun.env.API_KEY_API_FOOTBALL = undefined as unknown as string;

			const result = await PlayerService.importPlayerFromApi(154);
			const resultWithStatus = result as {
				code: number;
				response: { code: number; message: string };
			};

			expect(resultWithStatus.code).toBe(500);
			expect(resultWithStatus.response.message).toBe("API key not configured");

			Bun.env.API_KEY_API_FOOTBALL = "test-api-key";
		});

		test("calls external API with correct URL", async () => {
			spyOn(Player, "findOne").mockReturnValue(mockFindOne(null));
			fetchSpy = spyOnFetch().mockImplementation(
				async (url: string | URL | Request) => {
					const urlStr =
						typeof url === "string" ? url : url instanceof URL ? url.href : "";
					expect(urlStr).toContain("id=154");
					expect(urlStr).toContain("season=2024");
					return new Response(
						JSON.stringify({
							response: [{ player: mockPlayer, statistics: [mockStatEntry] }],
						}),
						{ status: 200 },
					);
				},
			);
			spyOn(Player, "create").mockReturnValue(
				Promise.resolve(
					makeDoc({ name: "Lionel Messi", externalId: 154 }, "newId"),
				) as unknown as ReturnType<typeof Player.create>,
			);

			await PlayerService.importPlayerFromApi(154);

			expect(fetchSpy).toHaveBeenCalledTimes(1);
		});

		test("creates player in database with correct fields", async () => {
			spyOn(Player, "findOne").mockReturnValue(mockFindOne(null));
			fetchSpy = spyOnFetch().mockImplementation(
				async () =>
					new Response(
						JSON.stringify({
							response: [{ player: mockPlayer, statistics: [mockStatEntry] }],
						}),
						{ status: 200 },
					),
			);
			const createSpy = spyOn(Player, "create").mockReturnValue(
				Promise.resolve(
					makeDoc(
						{
							name: "Lionel Messi",
							firstName: "Lionel",
							lastName: "Messi",
							age: 37,
							nationality: "Argentina",
							height: "169 cm",
							weight: "67 kg",
							number: 10,
							position: "Attacker",
							photo: "https://media.api-sports.io/football/players/154.png",
							team: "Inter Miami",
							league: "Major League Soccer",
							externalId: 154,
						},
						"newMongoId",
					),
				) as unknown as ReturnType<typeof Player.create>,
			);

			await PlayerService.importPlayerFromApi(154);

			expect(createSpy).toHaveBeenCalledWith({
				name: "Lionel Messi",
				firstName: "Lionel",
				lastName: "Messi",
				age: 37,
				birthdate: new Date("1987-06-24"),
				nationality: "Argentina",
				height: "169 cm",
				weight: "67 kg",
				number: 10,
				position: "Attacker",
				photo: "https://media.api-sports.io/football/players/154.png",
				team: "Inter Miami",
				league: "Major League Soccer",
				externalId: 154,
			});
		});

		test("returns 404 when player not found in external API", async () => {
			spyOn(Player, "findOne").mockReturnValue(mockFindOne(null));
			fetchSpy = spyOnFetch().mockImplementation(
				async () =>
					new Response(JSON.stringify({ response: [] }), { status: 200 }),
			);

			const result = await PlayerService.importPlayerFromApi(999999);
			const resultWithStatus = result as {
				code: number;
				response: { code: number; message: string };
			};

			expect(resultWithStatus.code).toBe(404);
			expect(resultWithStatus.response.message).toBe(
				"Player with external ID 999999 not found",
			);
		});

		test("returns 500 when external API call fails", async () => {
			spyOn(Player, "findOne").mockReturnValue(mockFindOne(null));
			fetchSpy = spyOnFetch().mockImplementation(
				async () => new Response("Server Error", { status: 500 }),
			);

			const result = await PlayerService.importPlayerFromApi(154);
			const resultWithStatus = result as {
				code: number;
				response: { code: number; message: string };
			};

			expect(resultWithStatus.code).toBe(500);
			expect(resultWithStatus.response.message).toBe(
				"Failed to fetch from external API",
			);
		});

		test("returns 201 with player data on successful import", async () => {
			spyOn(Player, "findOne").mockReturnValue(mockFindOne(null));
			fetchSpy = spyOnFetch().mockImplementation(
				async () =>
					new Response(
						JSON.stringify({
							response: [{ player: mockPlayer, statistics: [mockStatEntry] }],
						}),
						{ status: 200 },
					),
			);
			spyOn(Player, "create").mockReturnValue(
				Promise.resolve(
					makeDoc(
						{
							name: "Lionel Messi",
							firstName: "Lionel",
							lastName: "Messi",
							birthdate: new Date("1987-06-24"),
							nationality: "Argentina",
							height: "169 cm",
							weight: "67 kg",
							number: 10,
							position: "Attacker",
							photo: "https://media.api-sports.io/football/players/154.png",
							team: "Inter Miami",
							league: "Major League Soccer",
							externalId: 154,
						},
						"newMongoId",
					),
				) as unknown as ReturnType<typeof Player.create>,
			);

			const result = await PlayerService.importPlayerFromApi(154);
			const resultWithStatus = result as {
				code: number;
				response: {
					id: string;
					name: string;
					externalId: number;
					team: string;
					league: string;
				};
			};

			expect(resultWithStatus.code).toBe(201);
			expect(resultWithStatus.response.name).toBe("Lionel Messi");
			expect(resultWithStatus.response.externalId).toBe(154);
			expect(resultWithStatus.response.team).toBe("Inter Miami");
			expect(resultWithStatus.response.league).toBe("Major League Soccer");
			expect(resultWithStatus.response.id).toBe("newMongoId");
		});
	});
});
