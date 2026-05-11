import { Elysia } from "elysia";
import { healthcheckPlugin } from "elysia-healthcheck";
import mongoose from "mongoose";
import { fetchRemoteConfig } from "./config/config-server";
import { checkConnection, connectDB } from "./config/db";
import { registerWithEureka } from "./config/eureka";

fetchRemoteConfig("bun-backend", "local");

const port = Bun.env.PORT ? Number(Bun.env.PORT) : 3000;
await connectDB();

const app = new Elysia().use(
	healthcheckPlugin({
		checks: {
			liveness: [
				async () => {
					const isHealthy = await checkConnection();
					return {
						name: "MongoDB",
						healthy: isHealthy.connected,
						details: {
							host: `${mongoose.connection.host}:${mongoose.connection.port}`,
						},
					};
				},
			],
			readiness: [],
		},
	}),
);

app.get("/", () => "Hello Elysia");

app.listen({ port, hostname: "0.0.0.0" }, async () => {
	await registerWithEureka();
});

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
