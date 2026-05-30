import { describe, expect, test } from "bun:test";
import { Elysia } from "elysia";
import { AuthModule } from "../../src/modules/auth";

const testApp = new Elysia().use(AuthModule).get("/test", ({ user }) => user);

const handle = (headers?: Record<string, string>) =>
  testApp.handle(
    new Request("http://localhost/test", { headers: headers ?? {} }),
  );

describe("AuthModule", () => {
  describe("derive - user context", () => {
    test("extracts all 4 gateway headers", async () => {
      const res = await handle({
        "x-user-id": "uid-1",
        "x-user-role": "admin",
        "x-user-email": "admin@test.com",
        "x-user-token": "jwt-abc",
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({
        id: "uid-1",
        role: "admin",
        email: "admin@test.com",
        token: "jwt-abc",
      });
    });

    test("defaults when headers are missing", async () => {
      const res = await handle();

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({
        id: null,
        role: "guest",
        email: null,
        token: null,
      });
    });

    test("partial headers - only x-user-role", async () => {
      const res = await handle({ "x-user-role": "moderator" });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({
        id: null,
        role: "moderator",
        email: null,
        token: null,
      });
    });

    test("headers are case-insensitive", async () => {
      const res = await handle({ "X-User-Id": "upper-id" });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.id).toBe("upper-id");
    });
  });

  describe("onBeforeHandle - logging", () => {
    test("does not error with all headers", async () => {
      const res = await handle({
        "x-user-id": "uid-2",
        "x-user-role": "user",
        "x-user-email": "user@test.com",
        "x-user-token": "token-xyz",
      });

      expect(res.status).toBe(200);
    });

    test("does not error without headers", async () => {
      const res = await handle();
      expect(res.status).toBe(200);
    });

    test("does not error with empty headers", async () => {
      const res = await handle({});
      expect(res.status).toBe(200);
    });
  });

  describe("integration with other routes", () => {
    test("user context propagates to downstream routes", async () => {
      const downstream = new Elysia()
        .use(AuthModule)
        .get("/hello", ({ user }) => `hello ${user.id}`);

      const res = await downstream.handle(
        new Request("http://localhost/hello", {
          headers: { "x-user-id": "uid-3" },
        }),
      );

      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toBe("hello uid-3");
    });
  });
});
