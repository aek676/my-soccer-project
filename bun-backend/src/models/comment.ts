import { type InferSchemaType, model, Schema } from "mongoose";
import { LocationSchema } from "./location";

const CommentSchema = new Schema(
	{
		author: { type: String },
		text: { type: String, required: true, maxlength: 1000 },
		rating: { type: Number, required: true, min: 0, max: 5 },
		created: { type: Date, default: Date.now },
		location: LocationSchema,
		idPlayer: {
			type: Schema.Types.ObjectId,
			ref: "Player",
			required: true,
			index: true,
		},
		idUser: { type: String, index: true },
	},
	{
		timestamps: false,
		versionKey: false,
		collection: "comments",
	},
);

export type Comment = InferSchemaType<typeof CommentSchema>;
export const Comment = model("Comment", CommentSchema);
