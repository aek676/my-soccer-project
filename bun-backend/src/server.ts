import { Elysia } from "elysia";
import { connectDB } from "./config/db";

const port = Bun.env.PORT ? Number(Bun.env.PORT) : 3000;
await connectDB();

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

app.listen(port);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
