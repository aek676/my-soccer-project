import { type InferSchemaType, Schema } from "mongoose";

export const LocationSchema = new Schema(
	{
		type: {
			type: String,
			enum: ["Point"],
			default: "Point",
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
	{ _id: false },
);

export type Location = InferSchemaType<typeof LocationSchema>;
