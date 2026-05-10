declare module "bun" {
	interface Env {
		APP_NAME: string;
		INSTANCE_HOSTNAME: string;
		MONGODB_URI: string;
		MONGODB_DB_NAME: string;
		EUREKA_URL: string;
		PORT: number;
	}
}
