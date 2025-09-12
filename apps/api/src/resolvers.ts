import { FlipBook } from "./models/FlipBook";

export const resolvers = {
  Query: {
    flipBooks: async () => {
      return await FlipBook.find().sort({ order: 1, createdAt: -1 });
    },
    flipBookBySlug: async (_: any, { slug }: { slug: string }) => {
      return await FlipBook.findOne({ slug });
    },
  },
  Mutation: {
    createFlipBook: async (_: any, { input }: any) => {
      const maxOrder = await FlipBook.findOne()
        .sort({ order: -1 })
        .select("order");
      const order = (maxOrder?.order || 0) + 1;

      const doc = await FlipBook.create({
        ...input,
        order,
      });
      return String(doc._id);
    },
    updateFlipBook: async (_: any, { id, input }: any) => {
      const res = await FlipBook.findByIdAndUpdate(id, input, { new: true });
      return !!res;
    },
    reorderFlipBooks: async (_: any, { ids }: { ids: string[] }) => {
      try {
        // Update order based on the new array order
        const updatePromises = ids.map((id, index) =>
          FlipBook.findByIdAndUpdate(id, { order: index })
        );
        await Promise.all(updatePromises);
        return true;
      } catch (error) {
        console.error("Error reordering flipbooks:", error);
        return false;
      }
    },
  },
};
