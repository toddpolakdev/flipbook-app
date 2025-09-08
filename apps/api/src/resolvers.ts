import { FlipBook } from "./models/FlipBook";

export const resolvers = {
  Query: {
    flipBooks: async () => FlipBook.find(),
    flipBookBySlug: async (_: any, { slug }: { slug: string }) => {
      return FlipBook.findOne({ slug });
    },
  },
  Mutation: {
    createFlipBook: async (_: any, { input }: any) => {
      const doc = await FlipBook.create(input);
      return String(doc._id);
    },
    updateFlipBook: async (_: any, { id, input }: any) => {
      const res = await FlipBook.findByIdAndUpdate(id, input, { new: true });
      return !!res;
    },
    publishFlipBook: async (_: any, { id }: { id: string }) => {
      const res = await FlipBook.findByIdAndUpdate(id, {
        status: "published",
        publishedAt: new Date(),
      });
      return !!res;
    },
  },
};
