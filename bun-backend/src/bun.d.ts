declare module "bun" {
	interface Env {
		MONGODB_URI: string;
		MONGODB_DB_NAME: string;
		PORT: number;
	}
}
