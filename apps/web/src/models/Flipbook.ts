import { Schema, model, models } from "mongoose";

const FlipbookSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Flipbook = models.Flipbook || model("Flipbook", FlipbookSchema);

export default Flipbook;
