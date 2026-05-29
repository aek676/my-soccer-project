import { type InferSchemaType, model, Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    author: { type: String },
    text: { type: String, required: true, maxlength: 1000 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    created: { type: Date, default: Date.now },
    location: {
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
