import { Elysia } from "elysia";
import { healthcheckPlugin } from "elysia-healthcheck";
import mongoose from "mongoose";
import { buildConfig } from "./config/config-server";
import { checkConnection, connectDB } from "./config/db";
import { registerWithEureka } from "./config/eureka";

const config = await buildConfig();

console.log("Loaded configuration:\n", JSON.stringify(config, null, 2));

const port = Number(config.app.port);
await connectDB(config.datasource.url, config.datasource.db);

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
	await registerWithEureka(
		config.app.name || "bun-backend",
		config.eureka.hostname || "bun-backend",
		port,
	);
});

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
