import { Elysia } from "elysia";
import { connectDB } from "./config/db";
import { registerWithEureka } from "./config/eureka";

const port = Bun.env.PORT ? Number(Bun.env.PORT) : 3000;
await connectDB();

const app = new Elysia().get("/", () => "Hello Elysia");

app.listen({ port, hostname: "0.0.0.0" }, async () => {
	await registerWithEureka();
});

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
