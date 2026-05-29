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
import { Player } from "../../src/models/player";
import type { PlayerModel } from "../../src/modules/player/model";
import { PlayerService } from "../../src/modules/player/service";
import { mongoUrl } from "../setup";

describe("PlayerService - Integration Tests", () => {
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

	describe("getAllPlayers", () => {
		test("returns empty array when no players exist", async () => {
			const result = await PlayerService.getAllPlayers();

			expect(result).toEqual([]);
		});

		test("returns all players with id field", async () => {
			await Player.create([
				{ name: "Lionel Messi", team: "Inter Miami", position: "Forward" },
				{ name: "Kylian Mbappé", team: "Real Madrid", position: "Forward" },
			]);

			const result = await PlayerService.getAllPlayers();

			expect(result).toHaveLength(2);
			expect(result.map((p) => p.name).sort()).toEqual([
				"Kylian Mbappé",
				"Lionel Messi",
			]);
		});

		test("each player has id string and no _id or __v", async () => {
			await Player.create({ name: "Test Player", team: "Test Team" });

			const result = await PlayerService.getAllPlayers();

			expect(result).toHaveLength(1);
			expect(typeof result[0].id).toBe("string");
			expect(result[0].id).toMatch(/^[0-9a-f]{24}$/);
			expect(result[0]).not.toHaveProperty("_id");
			expect(result[0]).not.toHaveProperty("__v");
		});

		test("preserves player fields", async () => {
			await Player.create({
				name: "Erling Haaland",
				firstName: "Erling",
				lastName: "Haaland",
				age: 24,
				nationality: "Norwegian",
				team: "Manchester City",
				league: "Premier League",
				position: "Forward",
				number: 9,
			});

			const result = await PlayerService.getAllPlayers();

			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				name: "Erling Haaland",
				firstName: "Erling",
				lastName: "Haaland",
				age: 24,
				nationality: "Norwegian",
				team: "Manchester City",
				league: "Premier League",
				position: "Forward",
				number: 9,
			});
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
		};

		test("creates player and returns 201", async () => {
			const result = await PlayerService.createPlayer(validBody);
			const resultWithStatus = result as {
				code: number;
				response: { id: string; name: string };
			};

			expect(resultWithStatus.code).toBe(201);
			expect(resultWithStatus.response.name).toBe("Lionel Messi");
		});

		test("persists player to database", async () => {
			await PlayerService.createPlayer(validBody);

			const dbPlayer = await Player.findOne({ name: "Lionel Messi" }).lean();
			expect(dbPlayer).not.toBeNull();
			expect(dbPlayer!.team).toBe("Inter Miami");
		});

		test("returns valid MongoDB ObjectId as id", async () => {
			const result = await PlayerService.createPlayer(validBody);
			const resultWithStatus = result as {
				code: number;
				response: { id: string };
			};

			expect(resultWithStatus.response.id).toMatch(/^[0-9a-f]{24}$/);
		});

		test("response has no _id or __v", async () => {
			const result = await PlayerService.createPlayer(validBody);
			const resultWithStatus = result as {
				code: number;
				response: Record<string, unknown>;
			};

			expect(resultWithStatus.response).not.toHaveProperty("_id");
			expect(resultWithStatus.response).not.toHaveProperty("__v");
		});

		test("returns all provided fields", async () => {
			const result = await PlayerService.createPlayer(validBody);
			const resultWithStatus = result as {
				code: number;
				response: Record<string, unknown>;
			};

			expect(resultWithStatus.response).toMatchObject({
				name: "Lionel Messi",
				firstName: "Lionel",
				lastName: "Messi",
				age: 36,
				nationality: "Argentina",
				height: "170 cm",
				weight: "72 kg",
				number: 10,
				team: "Inter Miami",
				league: "Major League Soccer",
				position: "Forward",
				photo: "https://example.com/messi.jpg",
			});
		});
	});

	describe("getPlayerById", () => {
		test("throws CastError for invalid ObjectId", async () => {
			expect(() => PlayerService.getPlayerById("not-a-valid-id")).toThrow();
		});

		test("returns 404 when player not found", async () => {
			const validId = new mongoose.Types.ObjectId().toString();

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

		test("returns player when found", async () => {
			const player = await Player.create({
				name: "Vinícius Jr",
				team: "Real Madrid",
				position: "Left Winger",
			});

			const result = await PlayerService.getPlayerById(player._id.toString());

			expect(result).toMatchObject({
				name: "Vinícius Jr",
				team: "Real Madrid",
				position: "Left Winger",
			});
		});

		test("returns player with id field instead of _id", async () => {
			const player = await Player.create({ name: "Test Player" });

			const result = await PlayerService.getPlayerById(player._id.toString());

			const playerResult = result as PlayerModel["playerResponse"];
			expect(typeof playerResult.id).toBe("string");
			expect(playerResult.id).toBe(player._id.toString());
			expect(result).not.toHaveProperty("_id");
			expect(result).not.toHaveProperty("__v");
		});

		test("handles player with all optional fields", async () => {
			const player = await Player.create({
				name: "Full Player",
				firstName: "First",
				lastName: "Last",
				age: 25,
				birthdate: new Date("2000-01-01"),
				nationality: "Spanish",
				height: "180cm",
				weight: "75kg",
				number: 10,
				team: "Barcelona",
				league: "La Liga",
				position: "Midfielder",
				photo: "https://example.com/photo.jpg",
				location: {
					type: "Point",
					coordinates: [2.1734, 41.3851],
				},
			});

			const result = await PlayerService.getPlayerById(player._id.toString());

			expect(result).toMatchObject({
				name: "Full Player",
				firstName: "First",
				lastName: "Last",
				age: 25,
				nationality: "Spanish",
				height: "180cm",
				weight: "75kg",
				number: 10,
				team: "Barcelona",
				league: "La Liga",
				position: "Midfielder",
				photo: "https://example.com/photo.jpg",
			});
		});
	});
});
