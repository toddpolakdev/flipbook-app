import mongoose, { Schema } from "mongoose";

export type LocaleCode = "en" | "fr" | "de" | "it" | "nl";

const BlockSchema = new Schema(
  {
    kind: { type: String, required: true, enum: ["hero", "richText"] },
    title: String,
    subtitle: String,
    mediaId: String,
    html: String,
  },
  { _id: false }
);

const TranslationSchema = new Schema(
  {
    locale: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    blocks: { type: [BlockSchema], default: [] },
    seo: { title: String, description: String },
  },
  { _id: false }
);

const ArticleSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    sectionId: { type: Schema.Types.ObjectId, required: false },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    translations: { type: [TranslationSchema], default: [] },
    publishedAt: Date,
    createdBy: { type: Schema.Types.ObjectId },
    updatedBy: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export const Article =
  mongoose.models.Article || mongoose.model("Article", ArticleSchema);
