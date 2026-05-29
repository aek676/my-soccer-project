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
import { mapApiSportsPlayer } from "../../src/modules/player/model";
import { PlayerService } from "../../src/modules/player/service";
import type { ApiSportsPlayer } from "../../src/types/football-api";

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

const testLocation = { type: "Point" as const, coordinates: [0, 0] };

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
		spyOn(Player, "create").mockRestore();
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

	describe("createPlayer", () => {
		const validBody = {
			name: "Lionel Messi",
			firstName: "Lionel",
			lastName: "Messi",
			age: 36,
			birthdate: new Date("1987-06-24"),
			nationality: "Argentina",
			height: "170 cm",
			weight: "72 kg",
			number: 10,
			team: "Inter Miami",
			league: "Major League Soccer",
			position: "Forward",
			photo: "https://example.com/messi.jpg",
			location: { type: "Point" as const, coordinates: [0, 0] },
		};

		afterEach(() => {
			spyOn(Player, "create").mockRestore();
		});

		test("calls Player.create with correct fields", async () => {
			const createSpy = spyOn(Player, "create").mockReturnValue(
				Promise.resolve(
					makeDoc({ ...validBody }, "newId"),
				) as unknown as ReturnType<typeof Player.create>,
			);

			await PlayerService.createPlayer(validBody);

			expect(createSpy).toHaveBeenCalledWith({
				name: "Lionel Messi",
				firstName: "Lionel",
				lastName: "Messi",
				age: 36,
				birthdate: new Date("1987-06-24"),
				nationality: "Argentina",
				height: "170 cm",
				weight: "72 kg",
				number: 10,
				team: "Inter Miami",
				league: "Major League Soccer",
				position: "Forward",
				photo: "https://example.com/messi.jpg",
				location: { type: "Point" as const, coordinates: [0, 0] },
			});
		});

		test("returns 201 with created player data", async () => {
			spyOn(Player, "create").mockReturnValue(
				Promise.resolve(
					makeDoc({ ...validBody }, "createdId"),
				) as unknown as ReturnType<typeof Player.create>,
			);

			const result = await PlayerService.createPlayer(validBody);
			const resultWithStatus = result as {
				code: number;
				response: { id: string; name: string };
			};

			expect(resultWithStatus.code).toBe(201);
			expect(resultWithStatus.response.id).toBe("createdId");
			expect(resultWithStatus.response.name).toBe("Lionel Messi");
		});

		test("transforms _id to id and removes __v", async () => {
			spyOn(Player, "create").mockReturnValue(
				Promise.resolve(
					makeDoc({ ...validBody }, "abc123def456abc123def4"),
				) as unknown as ReturnType<typeof Player.create>,
			);

			const result = await PlayerService.createPlayer(validBody);
			const resultWithStatus = result as {
				code: number;
				response: Record<string, unknown>;
			};

			expect(resultWithStatus.response.id).toBe("abc123def456abc123def4");
			expect(resultWithStatus.response).not.toHaveProperty("_id");
			expect(resultWithStatus.response).not.toHaveProperty("__v");
		});
	});

	describe("searchPlayerByName", () => {
		let fetchSpy: FetchSpy;

		beforeAll(() => {
			Bun.env.API_KEY_API_FOOTBALL = "test-api-key";
		});

		afterAll(() => {
			Bun.env.API_KEY_API_FOOTBALL = undefined as unknown as string;
		});

		afterEach(() => {
			fetchSpy?.mockRestore();
		});

		test("returns 500 when API key is missing", async () => {
			Bun.env.API_KEY_API_FOOTBALL = undefined as unknown as string;

			const result = await PlayerService.searchPlayerByName("Messi");
			const resultWithStatus = result as {
				code: number;
				response: { code: number; message: string };
			};

			expect(resultWithStatus.code).toBe(500);
			expect(resultWithStatus.response.message).toBe("API key not configured");

			Bun.env.API_KEY_API_FOOTBALL = "test-api-key";
		});

		test("calls external API with correct URL", async () => {
			fetchSpy = spyOnFetch().mockImplementation(
				async (url: string | URL | Request) => {
					const urlStr =
						typeof url === "string" ? url : url instanceof URL ? url.href : "";
					expect(urlStr).toContain("search=Messi");
					expect(urlStr).toContain("players/profiles?");
					return new Response(JSON.stringify({ response: [] }), {
						status: 200,
					});
				},
			);

			await PlayerService.searchPlayerByName("Messi");

			expect(fetchSpy).toHaveBeenCalledTimes(1);
		});

		test("returns 500 when external API call fails", async () => {
			fetchSpy = spyOnFetch().mockImplementation(
				async () => new Response("Server Error", { status: 500 }),
			);

			const result = await PlayerService.searchPlayerByName("Messi");
			const resultWithStatus = result as {
				code: number;
				response: { code: number; message: string };
			};

			expect(resultWithStatus.code).toBe(500);
			expect(resultWithStatus.response.message).toBe(
				"Failed to fetch from external API",
			);
		});

		test("returns mapped players on success", async () => {
			const apiResponse = {
				response: [
					{
						player: {
							id: 154,
							name: "Lionel Messi",
							firstname: "Lionel",
							lastname: "Messi",
							age: 36,
							birth: {
								date: "1987-06-24",
								place: "Rosario",
								country: "Argentina",
							},
							nationality: "Argentina",
							height: "170 cm",
							weight: "72 kg",
							number: 10,
							position: "Forward",
							photo: "https://example.com/messi.jpg",
						},
					},
				],
			};
			fetchSpy = spyOnFetch().mockImplementation(
				async () => new Response(JSON.stringify(apiResponse), { status: 200 }),
			);

			const result = await PlayerService.searchPlayerByName("Messi");
			const resultArray = result as Array<{ id: string; name: string }>;

			expect(resultArray).toHaveLength(1);
			expect(resultArray[0].name).toBe("Lionel Messi");
			expect(resultArray[0].id).toBe("154");
		});

		test("returns empty array when no players found", async () => {
			fetchSpy = spyOnFetch().mockImplementation(
				async () =>
					new Response(JSON.stringify({ response: [] }), { status: 200 }),
			);

			const result = await PlayerService.searchPlayerByName("Unknown");

			expect(result).toEqual([]);
		});
	});

	describe("mapApiSportsPlayer", () => {
		test("maps API response to playerResponse format", () => {
			const apiPlayer: ApiSportsPlayer = {
				player: {
					id: 154,
					name: "Lionel Messi",
					firstname: "Lionel",
					lastname: "Messi",
					age: 36,
					birth: { date: "1987-06-24", place: "Rosario", country: "Argentina" },
					nationality: "Argentina",
					height: "170 cm",
					weight: "72 kg",
					number: 10,
					position: "Forward",
					photo: "https://example.com/messi.jpg",
				},
			};

			const result = mapApiSportsPlayer(apiPlayer);

			expect(result).toEqual({
				id: "154",
				name: "Lionel Messi",
				firstName: "Lionel",
				lastName: "Messi",
				age: 36,
				birthdate: new Date("1987-06-24"),
				nationality: "Argentina",
				height: "170 cm",
				weight: "72 kg",
				number: 10,
				position: "Forward",
				photo: "https://example.com/messi.jpg",
				externalId: 154,
			});
		});

		test("handles null optional fields", () => {
			const apiPlayer: ApiSportsPlayer = {
				player: {
					id: 999,
					name: "Unknown Player",
					firstname: null,
					lastname: null,
					age: null,
					birth: { date: null, place: null, country: "Unknown" },
					nationality: null,
					height: null,
					weight: null,
					number: null,
					position: null,
					photo: null,
				},
			};

			const result = mapApiSportsPlayer(apiPlayer);

			expect(result.id).toBe("999");
			expect(result.name).toBe("Unknown Player");
			expect(result.firstName).toBeUndefined();
			expect(result.lastName).toBeUndefined();
			expect(result.age).toBeUndefined();
			expect(result.birthdate).toBeUndefined();
			expect(result.nationality).toBeUndefined();
			expect(result.height).toBeUndefined();
			expect(result.weight).toBeUndefined();
			expect(result.number).toBeUndefined();
			expect(result.position).toBeUndefined();
			expect(result.photo).toBeUndefined();
			expect(result.externalId).toBe(999);
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

			const result = await PlayerService.importPlayerFromApi(154, {
				location: testLocation,
			});

			expect(result).not.toHaveProperty("code");
			expect(result).toHaveProperty("id", "existingId");
			expect(result).toHaveProperty("name", "Lionel Messi");
		});

		test("returns 500 when API key is missing", async () => {
			spyOn(Player, "findOne").mockReturnValue(mockFindOne(null));
			Bun.env.API_KEY_API_FOOTBALL = undefined as unknown as string;

			const result = await PlayerService.importPlayerFromApi(154, {
				location: testLocation,
			});
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

			await PlayerService.importPlayerFromApi(154, { location: testLocation });

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

			await PlayerService.importPlayerFromApi(154, { location: testLocation });

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
				location: testLocation,
			});
		});

		test("returns 404 when player not found in external API", async () => {
			spyOn(Player, "findOne").mockReturnValue(mockFindOne(null));
			fetchSpy = spyOnFetch().mockImplementation(
				async () =>
					new Response(JSON.stringify({ response: [] }), { status: 200 }),
			);

			const result = await PlayerService.importPlayerFromApi(999999, {
				location: testLocation,
			});
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

			const result = await PlayerService.importPlayerFromApi(154, {
				location: testLocation,
			});
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

			const result = await PlayerService.importPlayerFromApi(154, {
				location: testLocation,
			});
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
