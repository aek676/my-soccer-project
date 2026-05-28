import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { Player } from "../../src/models/player";
import { PlayerService } from "../../src/modules/player/service";

type MongooseQuery = ReturnType<typeof Player.find>;
type MongooseFindOneQuery = ReturnType<typeof Player.findById>;

const mockFind = <T>(data: T): MongooseQuery =>
	({ lean: () => Promise.resolve(data) }) as unknown as MongooseQuery;

const mockFindById = <T>(data: T): MongooseFindOneQuery =>
	({ lean: () => Promise.resolve(data) }) as unknown as MongooseFindOneQuery;

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
			});
			expect(result).not.toHaveProperty("_id");
			expect(result).not.toHaveProperty("__v");
		});
	});
});
