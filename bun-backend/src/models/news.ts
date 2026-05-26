import { type InferSchemaType, model, Schema } from "mongoose";

const NewsSchema = new Schema(
	{
		title: { type: String, required: true },
		body: { type: String, required: true },
		tags: { type: [String] },
		created: { type: Date, default: Date.now },
		idPlayer: { type: Schema.Types.ObjectId, ref: "Player", index: true },
	},
	{
		timestamps: false,
		versionKey: false,
		collection: "news",
	},
);

export type News = InferSchemaType<typeof NewsSchema>;
export const News = model("News", NewsSchema);
