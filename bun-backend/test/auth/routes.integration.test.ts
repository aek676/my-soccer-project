import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { Elysia } from "elysia";
import mongoose from "mongoose";
import { AuthModule } from "../../src/modules/auth";
import { PlayerModule } from "../../src/modules/player";
import { mongoUrl } from "../setup";

const app = new Elysia().use(AuthModule).use(PlayerModule);

const get = (url: string, headers?: Record<string, string>) =>
	app.handle(new Request(`http://localhost${url}`, { headers: headers ?? {} }));

describe("AuthModule - Gateway Headers", () => {
	beforeAll(async () => {
		await mongoose.connect(mongoUrl);
	}, 30000);

	afterAll(async () => {
		await mongoose.disconnect();
	});

	describe("header extraction", () => {
		test("extracts X-User-Id from gateway headers", async () => {
			const res = await get("/players", {
				"x-user-id": "user-123",
				"x-user-role": "admin",
				"x-user-email": "admin@example.com",
				"x-user-token": "eyJhbGciOiJIUzI1NiJ9.test",
			});

			expect(res.status).toBe(200);
		});

		test("defaults to guest role when X-User-Role is missing", async () => {
			const res = await get("/players");

			expect(res.status).toBe(200);
		});

		test("handles all 4 gateway headers", async () => {
			const res = await get("/players", {
				"x-user-id": "uid-456",
				"x-user-role": "user",
				"x-user-email": "user@test.com",
				"x-user-token": "token-abc",
			});

			expect(res.status).toBe(200);
		});

		test("handles empty headers gracefully", async () => {
			const res = await get("/players", {});

			expect(res.status).toBe(200);
		});
	});

	describe("headers reach downstream handlers", () => {
		test("user context is available in route handler", async () => {
			const testApp = new Elysia()
				.use(AuthModule)
				.get("/test-auth", ({ user }) => user);

			const res = await testApp.handle(
				new Request("http://localhost/test-auth", {
					headers: {
						"x-user-id": "uid-789",
						"x-user-role": "admin",
						"x-user-email": "test@example.com",
						"x-user-token": "jwt-token-xyz",
					},
				}),
			);

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data.id).toBe("uid-789");
			expect(data.role).toBe("admin");
			expect(data.email).toBe("test@example.com");
			expect(data.token).toBe("jwt-token-xyz");
		});

		test("defaults applied when headers are missing", async () => {
			const testApp = new Elysia()
				.use(AuthModule)
				.get("/test-auth", ({ user }) => user);

			const res = await testApp.handle(
				new Request("http://localhost/test-auth"),
			);

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data.id).toBeNull();
			expect(data.role).toBe("guest");
			expect(data.email).toBeNull();
			expect(data.token).toBeNull();
		});

		test("headers are case-insensitive", async () => {
			const testApp = new Elysia()
				.use(AuthModule)
				.get("/test-auth", ({ user }) => ({ userId: user.id }));

			const res = await testApp.handle(
				new Request("http://localhost/test-auth", {
					headers: { "X-User-Id": "uppercase-id" },
				}),
			);

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data.userId).toBe("uppercase-id");
		});
	});
});
