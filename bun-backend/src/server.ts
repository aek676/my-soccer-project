import { openapi } from "@elysia/openapi";
import { Elysia, status } from "elysia";
import { healthcheckPlugin } from "elysia-healthcheck";
import mongoose from "mongoose";
import { buildConfig } from "./config/config-server";
import { checkConnection, connectDB } from "./config/db";
import { registerWithEureka } from "./config/eureka";
import { authPlugin } from "./modules/auth";
import { CommentModule } from "./modules/comment";
import { IdealTeamModule } from "./modules/ideal-team";
import { PlayerModule } from "./modules/player";

const config = await buildConfig();

console.log("Loaded configuration:\n", JSON.stringify(config, null, 2));

const port = Number(config.app.port);
await connectDB(config.datasource.url, config.datasource.db);

const app = new Elysia()
	.onError(({ error, code }) => {
		if (code === "VALIDATION") {
			console.error("[VALIDATION ERROR]", JSON.stringify(error.all, null, 2));
			return status(422, { code: 422, message: error.all[0].message });
		}
		console.error(
			`[${code}]`,
			error instanceof Error ? error.message : "Unknown error",
		);
		return { code: 500, message: "Internal server error" };
	})
	.use(
		openapi({
			documentation: {
				info: {
					title: "My Soccer Project API",
					version: "1.0.0",
					description:
						"Bun/Elysia backend for the My Soccer Project microservice application. Provides endpoints for managing players, comments, and AI-generated ideal team selection.",
				},
				tags: [
					{ name: "Players", description: "Football player management" },
					{ name: "Comments", description: "Player comments and ratings" },
					{
						name: "Ideal Team",
						description: "AI-powered ideal team generation and user teams",
					},
				],
			},
			exclude: {
				paths: ["/", "/health"],
			},
		}),
	)
	.use(
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
	)
	.use(authPlugin)
	.use(PlayerModule)
	.use(CommentModule)
	.use(IdealTeamModule);

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
