import mongoose, { connect } from "mongoose";

export const connectDB = async (mongodbUri: string, mongodbName: string) => {
	if (!mongodbUri) throw new Error("MONGO_URI is not set");

	try {
		await connect(mongodbUri, {
			dbName: mongodbName,
			autoIndex: true,
		});

		console.log("📗 MongoDB connected successfully");
	} catch (error) {
		console.error("MongoDB connection failed: ", error);
		throw error;
	}
};

export const checkConnection = async (): Promise<{
	connected: boolean;
	error?: string;
}> => {
	if (mongoose.connection.readyState !== mongoose.ConnectionStates.connected) {
		return { connected: false, error: "No active connection" };
	}

	const db = mongoose.connection.db;
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
