import { type InferSchemaType, model, Schema } from "mongoose";

const IdealTeamSchema = new Schema(
	{
		name: { type: String, required: true },
		created: { type: Date, default: Date.now },
		idUser: { type: String, required: true, index: true },
		players: [{ type: Schema.Types.ObjectId, ref: "Player" }],
	},
	{
		timestamps: false,
		versionKey: false,
		collection: "idealTeams",
	},
);

export type IdealTeam = InferSchemaType<typeof IdealTeamSchema>;
export const IdealTeam = model("IdealTeam", IdealTeamSchema);
