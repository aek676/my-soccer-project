import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";

const mockGenerateText = mock();

mock.module("ai", () => ({
	generateText: mockGenerateText,
	Output: { object: () => ({ schema: {} }) },
}));

mock.module("@ai-sdk/groq", () => ({
	createGroq: () => () => ({}),
}));

import { IdealTeam } from "../../src/models/ideal-team";
import { Player } from "../../src/models/player";
import { IdealTeamService } from "../../src/modules/ideal-team/service";

type PlayerQuery = ReturnType<typeof Player.find>;
type IdealTeamFindByIdQuery = ReturnType<typeof IdealTeam.findById>;
type IdealTeamFindQuery = ReturnType<typeof IdealTeam.find>;

const mockPlayerFind = <T>(data: T): PlayerQuery =>
	({ lean: () => Promise.resolve(data) }) as unknown as PlayerQuery;

const mockFindByIdWithPopulate = <T>(data: T): IdealTeamFindByIdQuery =>
	({
		populate: () => ({
			lean: () => Promise.resolve(data),
		}),
	}) as unknown as IdealTeamFindByIdQuery;

const mockFindWithPopulate = <T>(data: T): IdealTeamFindQuery =>
	({
		populate: () => ({
			lean: () => Promise.resolve(data),
		}),
	}) as unknown as IdealTeamFindQuery;

const makeDoc = (data: Record<string, unknown>, id: string) => ({
	_id: { toString: () => id },
	...data,
});

const makePlayerDoc = (name: string, id: string, position = "Midfielder") => ({
	_id: { toString: () => id },
	name,
	position,
	team: "Test Team",
	age: 25,
	nationality: "Test",
});

const playerIds = Array.from(
	{ length: 11 },
	(_, i) => `507f1f77bcf86cd79943${String(i).padStart(4, "0")}`,
);

const makePlayers = () =>
	playerIds.map((id, i) => makePlayerDoc(`Player ${i + 1}`, id));

describe("IdealTeamService - Unit Tests", () => {
	afterEach(() => {
		spyOn(Player, "find").mockRestore();
		spyOn(IdealTeam, "create").mockRestore();
		spyOn(IdealTeam, "findById").mockRestore();
		spyOn(IdealTeam, "find").mockRestore();
		mockGenerateText.mockRestore();
	});

	describe("generateIdealTeam", () => {
		test("returns 400 when fewer than 11 players in database", async () => {
			spyOn(Player, "find").mockReturnValue(
				mockPlayerFind([makePlayerDoc("Player 1", "507f1f77bcf86cd799430001")]),
			);

			const result = await IdealTeamService.generateIdealTeam();

			expect(result).toHaveProperty("code", 400);
			expect(
				(result as { response: { message: string } }).response.message,
			).toContain("Not enough players");
		});

		test("returns 500 when GROQ_API_KEY is missing", async () => {
			spyOn(Player, "find").mockReturnValue(mockPlayerFind(makePlayers()));

			const originalKey = Bun.env.GROQ_API_KEY;
			Bun.env.GROQ_API_KEY = undefined as unknown as string;

			const result = await IdealTeamService.generateIdealTeam();

			expect(result).toHaveProperty("code", 500);
			expect(
				(result as { response: { message: string } }).response.message,
			).toBe("GROQ_API_KEY not configured");

			Bun.env.GROQ_API_KEY = originalKey;
		});

		test("calls AI and returns mapped players on success", async () => {
			spyOn(Player, "find").mockReturnValue(mockPlayerFind(makePlayers()));

			const originalKey = Bun.env.GROQ_API_KEY;
			Bun.env.GROQ_API_KEY = "test-key";

			mockGenerateText.mockImplementation(() =>
				Promise.resolve({
					output: {
						selectedIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
					},
				}),
			);

			const result = await IdealTeamService.generateIdealTeam();

			expect(Array.isArray(result)).toBe(true);
			const players = result as Array<{ id: string; name: string }>;
			expect(players).toHaveLength(11);
			expect(players[0].name).toBe("Player 1");
			expect(players[0].id).toBe("507f1f77bcf86cd799430000");
			expect(players[10].name).toBe("Player 11");

			Bun.env.GROQ_API_KEY = originalKey;
		});

		test("filters out invalid indices from AI response", async () => {
			spyOn(Player, "find").mockReturnValue(mockPlayerFind(makePlayers()));

			const originalKey = Bun.env.GROQ_API_KEY;
			Bun.env.GROQ_API_KEY = "test-key";

			mockGenerateText.mockImplementation(() =>
				Promise.resolve({
					output: { selectedIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100] },
				}),
			);

			const result = await IdealTeamService.generateIdealTeam();

			expect(Array.isArray(result)).toBe(true);
			const players = result as Array<{ id: string; name: string }>;
			expect(players).toHaveLength(10);

			Bun.env.GROQ_API_KEY = originalKey;
		});

		test("calls Player.find with empty filter", async () => {
			spyOn(Player, "find").mockReturnValue(mockPlayerFind(makePlayers()));

			const originalKey = Bun.env.GROQ_API_KEY;
			Bun.env.GROQ_API_KEY = "test-key";

			mockGenerateText.mockImplementation(() =>
				Promise.resolve({
					output: { selectedIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
				}),
			);

			await IdealTeamService.generateIdealTeam();

			const findSpy = spyOn(Player, "find");
			expect(findSpy).toHaveBeenCalledWith({});

			Bun.env.GROQ_API_KEY = originalKey;
		});
	});

	describe("saveIdealTeam", () => {
		const validBody = {
			name: "My Team",
			players: playerIds,
		};

		test("returns 400 when players count is not 11", async () => {
			const result = await IdealTeamService.saveIdealTeam(
				{ name: "Bad Team", players: ["507f1f77bcf86cd799430001"] },
				"user-1",
			);

			expect(result).toHaveProperty("code", 400);
			expect(
				(result as { response: { message: string } }).response.message,
			).toBe("Team must have exactly 11 players");
		});

		test("returns 400 when players not found in database", async () => {
			spyOn(Player, "find").mockReturnValue(mockPlayerFind([]));

			const result = await IdealTeamService.saveIdealTeam(validBody, "user-1");

			expect(result).toHaveProperty("code", 400);
			expect(
				(result as { response: { message: string } }).response.message,
			).toBe("One or more players not found");
		});

		test("returns 500 when populated team retrieval fails", async () => {
			spyOn(Player, "find").mockReturnValue(mockPlayerFind(makePlayers()));
			spyOn(IdealTeam, "create").mockReturnValue(
				Promise.resolve(
					makeDoc({ name: "My Team" }, "507f1f77bcf86cd799439099"),
				) as unknown as ReturnType<typeof IdealTeam.create>,
			);
			spyOn(IdealTeam, "findById").mockReturnValue(
				mockFindByIdWithPopulate(null),
			);

			const result = await IdealTeamService.saveIdealTeam(validBody, "user-1");

			expect(result).toHaveProperty("code", 500);
			expect(
				(result as { response: { message: string } }).response.message,
			).toBe("Failed to retrieve saved team");
		});

		test("creates team and returns populated response", async () => {
			const mockPlayers = makePlayers();
			spyOn(Player, "find").mockReturnValue(mockPlayerFind(mockPlayers));
			spyOn(IdealTeam, "create").mockReturnValue(
				Promise.resolve(
					makeDoc({ name: "My Team" }, "507f1f77bcf86cd799439099"),
				) as unknown as ReturnType<typeof IdealTeam.create>,
			);

			const populatedTeam = {
				_id: { toString: () => "507f1f77bcf86cd799439099" },
				name: "My Team",
				created: new Date("2024-01-01"),
				idUser: "user-1",
				players: mockPlayers,
			};
			spyOn(IdealTeam, "findById").mockReturnValue(
				mockFindByIdWithPopulate(populatedTeam),
			);

			const result = await IdealTeamService.saveIdealTeam(validBody, "user-1");

			expect(result).toHaveProperty("id", "507f1f77bcf86cd799439099");
			expect(result).toHaveProperty("name", "My Team");
			expect(result).toHaveProperty("idUser", "user-1");
			expect((result as { players: unknown[] }).players).toHaveLength(11);
			expect(
				(result as { players: Array<{ name: string }> }).players[0].name,
			).toBe("Player 1");
		});

		test("calls IdealTeam.create with correct fields", async () => {
			const mockPlayers = makePlayers();
			spyOn(Player, "find").mockReturnValue(mockPlayerFind(mockPlayers));
			const createSpy = spyOn(IdealTeam, "create").mockReturnValue(
				Promise.resolve(
					makeDoc({ name: "My Team" }, "507f1f77bcf86cd799439099"),
				) as unknown as ReturnType<typeof IdealTeam.create>,
			);
			spyOn(IdealTeam, "findById").mockReturnValue(
				mockFindByIdWithPopulate({
					_id: { toString: () => "507f1f77bcf86cd799439099" },
					name: "My Team",
					created: new Date(),
					idUser: "user-1",
					players: mockPlayers,
				}),
			);

			await IdealTeamService.saveIdealTeam(validBody, "user-1");

			expect(createSpy).toHaveBeenCalledWith({
				name: "My Team",
				players: playerIds,
				idUser: "user-1",
			});
		});

		test("calls Player.find with correct player IDs", async () => {
			const mockPlayers = makePlayers();
			spyOn(Player, "find").mockReturnValue(mockPlayerFind(mockPlayers));
			spyOn(IdealTeam, "create").mockReturnValue(
				Promise.resolve(
					makeDoc({ name: "My Team" }, "507f1f77bcf86cd799439099"),
				) as unknown as ReturnType<typeof IdealTeam.create>,
			);
			spyOn(IdealTeam, "findById").mockReturnValue(
				mockFindByIdWithPopulate({
					_id: { toString: () => "507f1f77bcf86cd799439099" },
					name: "My Team",
					created: new Date(),
					idUser: "user-1",
					players: mockPlayers,
				}),
			);

			await IdealTeamService.saveIdealTeam(validBody, "user-1");

			const findSpy = spyOn(Player, "find");
			expect(findSpy).toHaveBeenCalledWith({
				_id: { $in: playerIds },
			});
		});
	});

	describe("getUserTeams", () => {
		test("returns teams for user with populated players", async () => {
			const mockPlayers = makePlayers();
			const mockTeams = [
				{
					_id: { toString: () => "team1id000000000000" },
					name: "Team 1",
					created: new Date("2024-01-01"),
					idUser: "user-1",
					players: mockPlayers,
				},
			];
			spyOn(IdealTeam, "find").mockReturnValue(mockFindWithPopulate(mockTeams));

			const result = await IdealTeamService.getUserTeams("user-1");

			expect(result).toHaveProperty("code", 200);
			const teams = (
				result as { response: Array<{ id: string; name: string }> }
			).response;
			expect(teams).toHaveLength(1);
			expect(teams[0].id).toBe("team1id000000000000");
			expect(teams[0].name).toBe("Team 1");
		});

		test("returns empty array when no teams exist", async () => {
			spyOn(IdealTeam, "find").mockReturnValue(mockFindWithPopulate([]));

			const result = await IdealTeamService.getUserTeams("user-1");

			expect(result).toHaveProperty("code", 200);
			expect((result as { response: unknown[] }).response).toEqual([]);
		});

		test("maps _id to id and removes __v", async () => {
			const mockPlayers = makePlayers();
			const mockTeams = [
				{
					_id: { toString: () => "team1id000000000000" },
					__v: 0,
					name: "Team 1",
					created: new Date("2024-01-01"),
					idUser: "user-1",
					players: mockPlayers,
				},
			];
			spyOn(IdealTeam, "find").mockReturnValue(mockFindWithPopulate(mockTeams));

			const result = await IdealTeamService.getUserTeams("user-1");

			const teams = (result as { response: Array<Record<string, unknown>> })
				.response;
			expect(teams[0]).toHaveProperty("id", "team1id000000000000");
			expect(teams[0]).not.toHaveProperty("_id");
			expect(teams[0]).not.toHaveProperty("__v");
		});

		test("calls IdealTeam.find with correct userId filter", async () => {
			spyOn(IdealTeam, "find").mockReturnValue(mockFindWithPopulate([]));

			await IdealTeamService.getUserTeams("user-123");

			const findSpy = spyOn(IdealTeam, "find");
			expect(findSpy).toHaveBeenCalledWith({ idUser: "user-123" });
		});

		test("populates players field", async () => {
			const mockPlayers = makePlayers();
			const mockTeams = [
				{
					_id: { toString: () => "team1id000000000000" },
					name: "Team 1",
					created: new Date(),
					idUser: "user-1",
					players: mockPlayers,
				},
			];
			spyOn(IdealTeam, "find").mockReturnValue(mockFindWithPopulate(mockTeams));

			const result = await IdealTeamService.getUserTeams("user-1");

			const teams = (result as { response: Array<{ players: unknown[] }> })
				.response;
			expect(teams[0].players).toHaveLength(11);
			expect((teams[0].players as Array<{ name: string }>)[0].name).toBe(
				"Player 1",
			);
		});
	});
});
