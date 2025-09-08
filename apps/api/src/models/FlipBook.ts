import mongoose, { Schema } from "mongoose";

const FlipBookTranslationSchema = new Schema(
  {
    locale: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    images: { type: [String], required: true }, // each page is an image URL
  },
  { _id: false }
);

const FlipBookSettingsSchema = new Schema(
  {
    width: Number,
    height: Number,
    backgroundColor: String,
    showPageNumbers: Boolean,
  },
  { _id: false }
);

const FlipBookSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    tags: [String],
    translations: { type: [FlipBookTranslationSchema], required: true },
    settings: FlipBookSettingsSchema,
    publishedAt: Date,
  },
  { timestamps: true }
);

export const FlipBook =
  mongoose.models.FlipBook || mongoose.model("FlipBook", FlipBookSchema);
