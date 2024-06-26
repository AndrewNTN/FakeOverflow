// Answer Document Schema
import mongoose, { Schema } from "mongoose";
import Answer from "../../types/answer";

const answers = new Schema<Answer>(
  {
    text: { type: String, required: true },
    author: { type: Schema.ObjectId, ref: "User", required: true },
    comments: [{ type: Schema.ObjectId, ref: "Comment" }],
    votes: { type: Number, default: 0 },
    creationTime: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const AnswerSchema = mongoose.model<Answer>("Answer", answers);
export default AnswerSchema;
