import mongoose from "mongoose";

let cached: typeof mongoose | null = null;

export async function connectDB(uri?: string) {
  if (cached) return cached;
  const mongoUri = uri || process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGODB_URI not set");
  cached = await mongoose.connect(mongoUri);
  return cached;
}
