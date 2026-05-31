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
import { IdealTeam } from "../../src/models/ideal-team";
import { Player } from "../../src/models/player";
import { IdealTeamService } from "../../src/modules/ideal-team/service";
import { mongoUrl } from "../setup";

describe("IdealTeamService - Integration Tests", () => {
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

	describe("saveIdealTeam", () => {
		test("creates team and persists to database", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: "Midfielder",
					team: "Test Team",
				})),
			);
			const playerIds = players.map((p) => p._id.toString());

			const result = await IdealTeamService.saveIdealTeam(
				{ name: "My Team", players: playerIds },
				"user-1",
			);

			expect(result).toHaveProperty("id");
			expect(result).toHaveProperty("name", "My Team");
			expect((result as { players: unknown[] }).players).toHaveLength(11);

			const dbTeam = await IdealTeam.findOne({ name: "My Team" });
			expect(dbTeam).not.toBeNull();
			expect(dbTeam?.idUser).toBe("user-1");
		});

		test("returns 400 when players do not exist in database", async () => {
			const fakeIds = Array.from(
				{ length: 11 },
				(_, i) => `507f1f77bcf86cd79943${String(i).padStart(4, "0")}`,
			);

			const result = await IdealTeamService.saveIdealTeam(
				{ name: "My Team", players: fakeIds },
				"user-1",
			);

			expect(result).toHaveProperty("code", 400);
			expect(
				(result as { response: { message: string } }).response.message,
			).toBe("One or more players not found");
		});

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

		test("populates players in response with correct fields", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: i === 0 ? "Goalkeeper" : "Midfielder",
					team: "Test Team",
					age: 25,
					nationality: "Test",
				})),
			);
			const playerIds = players.map((p) => p._id.toString());

			const result = await IdealTeamService.saveIdealTeam(
				{ name: "My Team", players: playerIds },
				"user-1",
			);

			const resultObj = result as {
				players: Array<{ name: string; position: string }>;
			};
			expect(resultObj.players[0].name).toBe("Player 1");
			expect(resultObj.players[0].position).toBe("Goalkeeper");
		});

		test("response has no _id or __v fields", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: "Midfielder",
				})),
			);
			const playerIds = players.map((p) => p._id.toString());

			const result = await IdealTeamService.saveIdealTeam(
				{ name: "My Team", players: playerIds },
				"user-1",
			);

			const resultObj = result as Record<string, unknown>;
			expect(resultObj).not.toHaveProperty("_id");
			expect(resultObj).not.toHaveProperty("__v");
		});

		test("idUser is set to correct user", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: "Midfielder",
				})),
			);
			const playerIds = players.map((p) => p._id.toString());

			const result = await IdealTeamService.saveIdealTeam(
				{ name: "My Team", players: playerIds },
				"user-123",
			);

			expect(result).toHaveProperty("idUser", "user-123");
		});
	});

	describe("getUserTeams", () => {
		test("returns saved teams with populated player details", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: "Midfielder",
					team: "Test Team",
				})),
			);

			await IdealTeam.create({
				name: "Team A",
				idUser: "user-1",
				players: players.map((p) => p._id),
			});

			const result = await IdealTeamService.getUserTeams("user-1");

			expect(result).toHaveProperty("code", 200);
			const teams = (
				result as { response: Array<{ name: string; players: unknown[] }> }
			).response;
			expect(teams).toHaveLength(1);
			expect(teams[0].name).toBe("Team A");
			expect(teams[0].players).toHaveLength(11);
		});

		test("returns empty array for user with no teams", async () => {
			const result = await IdealTeamService.getUserTeams("user-999");

			expect(result).toHaveProperty("code", 200);
			expect((result as { response: unknown[] }).response).toEqual([]);
		});

		test("only returns teams for the specified user", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: "Midfielder",
				})),
			);
			const playerIds = players.map((p) => p._id);

			await IdealTeam.create({
				name: "User 1 Team",
				idUser: "user-1",
				players: playerIds,
			});
			await IdealTeam.create({
				name: "User 2 Team",
				idUser: "user-2",
				players: playerIds,
			});

			const result = await IdealTeamService.getUserTeams("user-1");

			const teams = (result as { response: Array<{ name: string }> }).response;
			expect(teams).toHaveLength(1);
			expect(teams[0].name).toBe("User 1 Team");
		});

		test("returns multiple teams for user", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: "Midfielder",
				})),
			);
			const playerIds = players.map((p) => p._id);

			await IdealTeam.create({
				name: "Team A",
				idUser: "user-1",
				players: playerIds,
			});
			await IdealTeam.create({
				name: "Team B",
				idUser: "user-1",
				players: playerIds,
			});

			const result = await IdealTeamService.getUserTeams("user-1");

			const teams = (result as { response: Array<{ name: string }> }).response;
			expect(teams).toHaveLength(2);
		});

		test("response has no _id or __v fields", async () => {
			const players = await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: "Midfielder",
				})),
			);

			await IdealTeam.create({
				name: "Team A",
				idUser: "user-1",
				players: players.map((p) => p._id),
			});

			const result = await IdealTeamService.getUserTeams("user-1");

			const teams = (result as { response: Array<Record<string, unknown>> })
				.response;
			expect(teams[0]).not.toHaveProperty("_id");
			expect(teams[0]).not.toHaveProperty("__v");
		});
	});

	describe("generateIdealTeam", () => {
		test("returns 400 when fewer than 11 players in database", async () => {
			await Player.create({ name: "Only Player", position: "GK" });

			const result = await IdealTeamService.generateIdealTeam();

			expect(result).toHaveProperty("code", 400);
			expect(
				(result as { response: { message: string } }).response.message,
			).toContain("Not enough players");
		});

		test("returns 500 when GROQ_API_KEY is not configured", async () => {
			await Player.create(
				Array.from({ length: 11 }, (_, i) => ({
					name: `Player ${i + 1}`,
					position: "Midfielder",
				})),
			);

			const originalKey = Bun.env.GROQ_API_KEY;
			Bun.env.GROQ_API_KEY = undefined as unknown as string;

			const result = await IdealTeamService.generateIdealTeam();

			expect(result).toHaveProperty("code", 500);
			expect(
				(result as { response: { message: string } }).response.message,
			).toBe("GROQ_API_KEY not configured");

			Bun.env.GROQ_API_KEY = originalKey;
		});
	});
});
