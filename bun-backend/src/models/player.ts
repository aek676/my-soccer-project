import { type InferSchemaType, model, Schema } from "mongoose";
import { LocationSchema } from "./location";

const PlayerSchema = new Schema(
	{
		name: { type: String, required: true },
		firstName: { type: String },
		lastName: { type: String },
		age: { type: Number },
		birthdate: { type: Date },
		nationality: { type: String },
		height: { type: String },
		weight: { type: String },
		number: { type: Number },
		team: { type: String },
		league: { type: String },
		position: { type: String },
		photo: { type: String },
		externalId: { type: Number, sparse: true, unique: true },
		location: LocationSchema,
		created: { type: Date, default: Date.now },
	},
	{
		timestamps: false,
		versionKey: false,
		collection: "players",
	},
);

export type Player = InferSchemaType<typeof PlayerSchema>;
export const Player = model("Player", PlayerSchema);
