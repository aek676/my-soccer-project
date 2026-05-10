import { ConnectionStates, connect, connection } from "mongoose";

export const connectDB = async () => {
	if (!Bun.env.MONGODB_URI) throw new Error("MONGO_URI is not set");

	try {
		await connect(Bun.env.MONGODB_URI, {
			dbName: Bun.env.MONGODB_DB_NAME,
			autoIndex: true,
		});
	} catch (error) {
		console.error("MongoDB connection failed: ", error);
		throw error;
	}
};

export const checkConnection = async (): Promise<{
	connected: boolean;
	error?: string;
}> => {
	if (connection.readyState !== ConnectionStates.connected) {
		return { connected: false, error: "No active connection" };
	}

	const db = connection.db;
	if (!db) {
		return { connected: false, error: "Database not initialized" };
	}

	try {
		await db.command({ ping: 1 });
		return { connected: true };
	} catch (error) {
		return { connected: false, error: (error as Error).message };
	}
};
