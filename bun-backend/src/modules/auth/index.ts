import { Elysia } from "elysia";

export const AuthModule = new Elysia({ name: "auth" })
	.onBeforeHandle({ as: "global" }, ({ request, headers }) => {
		console.log(
			`[Auth] ${request.method} ${request.url} → userId=${headers["x-user-id"] ?? "anonymous"}, role=${headers["x-user-role"] ?? "guest"}, email=${headers["x-user-email"] ?? "anonymous"}, token=${headers["x-user-token"] ?? "anonymous"}`,
		);
	})
	.derive({ as: "global" }, ({ headers }) => ({
		user: {
			id: headers["x-user-id"] ?? null,
			role: headers["x-user-role"] ?? "guest",
			email: headers["x-user-email"] ?? null,
			token: headers["x-user-token"] ?? null,
		},
	}));
