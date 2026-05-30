import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { Comment } from "../../src/models/comment";
import { Player } from "../../src/models/player";
import { CommentService } from "../../src/modules/comment/service";

type MongooseQuery = ReturnType<typeof Comment.find>;
type MongooseFindByIdQuery = ReturnType<typeof Player.findById>;
type MongooseFindByIdDeleteQuery = ReturnType<typeof Comment.findByIdAndDelete>;

const mockFind = <T>(data: T): MongooseQuery =>
	({ lean: () => Promise.resolve(data) }) as unknown as MongooseQuery;

const mockFindById = <T>(data: T): MongooseFindByIdQuery =>
	({ lean: () => Promise.resolve(data) }) as unknown as MongooseFindByIdQuery;

const mockFindByIdAndDelete = <T>(data: T): MongooseFindByIdDeleteQuery =>
	Promise.resolve(data) as unknown as MongooseFindByIdDeleteQuery;

const makeDoc = (data: Record<string, unknown>, id: string) => ({
	_id: { toString: () => id },
	toObject: () => ({ ...data, _id: { toString: () => id } }),
});

const validPlayerId = "507f1f77bcf86cd799439011";
const validCommentId = "507f1f77bcf86cd799439012";

const mockPlayer = {
	_id: { toString: () => validPlayerId },
	name: "Lionel Messi",
};

describe("CommentService - Unit Tests", () => {
	afterEach(() => {
		spyOn(Player, "findById").mockRestore();
		spyOn(Comment, "find").mockRestore();
		spyOn(Comment, "create").mockRestore();
		spyOn(Comment, "findByIdAndDelete").mockRestore();
	});

	describe("getCommentsByPlayerId", () => {
		test("returns comments when player exists", async () => {
			spyOn(Player, "findById").mockReturnValue(mockFindById(mockPlayer));
			const mockComments = [
				{
					_id: { toString: () => validCommentId },
					__v: 0,
					text: "Great player!",
					rating: 5,
					idPlayer: { toString: () => validPlayerId },
					idUser: "user-1",
					author: "Fan",
				},
			];
			spyOn(Comment, "find").mockReturnValue(mockFind(mockComments));

			const result = await CommentService.getCommentsByPlayerId(validPlayerId);

			const comments = result as unknown as Array<Record<string, unknown>>;
			expect(comments).toHaveLength(1);
			expect(comments[0].id).toBe(validCommentId);
			expect(comments[0].text).toBe("Great player!");
		});

		test("returns empty array when player exists but no comments", async () => {
			spyOn(Player, "findById").mockReturnValue(mockFindById(mockPlayer));
			spyOn(Comment, "find").mockReturnValue(mockFind([]));

			const result = await CommentService.getCommentsByPlayerId(validPlayerId);

			expect(result).toEqual([]);
		});

		test("returns 404 when player does not exist", async () => {
			spyOn(Player, "findById").mockReturnValue(mockFindById(null));

			const result = await CommentService.getCommentsByPlayerId(
				"507f1f77bcf86cd799439099",
			);

			expect(result).toHaveProperty("code", 404);
			expect(result).toHaveProperty("response");
			expect(
				(result as { response: { code: number; message: string } }).response,
			).toEqual({
				code: 404,
				message: "Player not found",
			});
		});
	});

	describe("createComment", () => {
		const validBody = {
			text: "Amazing goal!",
			rating: 5,
			idPlayer: validPlayerId,
		};

		test("creates comment and returns 201 when player exists", async () => {
			spyOn(Player, "findById").mockReturnValue(mockFindById(mockPlayer));
			spyOn(Comment, "create").mockReturnValue(
				Promise.resolve(
					makeDoc(
						{ ...validBody, idUser: "user-1", author: "Fan" },
						"newCommentId",
					),
				) as unknown as ReturnType<typeof Comment.create>,
			);

			const result = await CommentService.createComment(validBody, "user-1");
			const resultWithStatus = result as {
				code: number;
				response: { id: string; text: string; idUser: string };
			};

			expect(resultWithStatus.code).toBe(201);
			expect(resultWithStatus.response.id).toBe("newCommentId");
			expect(resultWithStatus.response.text).toBe("Amazing goal!");
			expect(resultWithStatus.response.idUser).toBe("user-1");
		});

		test("returns 404 when player does not exist", async () => {
			spyOn(Player, "findById").mockReturnValue(mockFindById(null));

			const result = await CommentService.createComment(validBody, "user-1");

			expect(result).toHaveProperty("code", 404);
			expect(
				(result as { response: { code: number; message: string } }).response,
			).toEqual({
				code: 404,
				message: "Player not found",
			});
		});
	});

	describe("deleteComment", () => {
		test("deletes comment and returns 200 when found", async () => {
			spyOn(Comment, "findByIdAndDelete").mockReturnValue(
				mockFindByIdAndDelete({ _id: { toString: () => validCommentId } }),
			);

			const result = await CommentService.deleteComment(validCommentId);

			expect(result).toEqual({ code: 200, message: "Comment deleted" });
		});

		test("returns 404 when comment does not exist", async () => {
			spyOn(Comment, "findByIdAndDelete").mockReturnValue(
				mockFindByIdAndDelete(null),
			);

			const result = await CommentService.deleteComment(
				"507f1f77bcf86cd799439099",
			);

			expect(result).toHaveProperty("code", 404);
			expect(
				(result as { response: { code: number; message: string } }).response,
			).toEqual({
				code: 404,
				message: "Comment not found",
			});
		});
	});
});
