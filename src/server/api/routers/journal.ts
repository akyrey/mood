import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const journalRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.journalEntry.create({
        data: {
          content: input.content,
          userId: ctx.user.id,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.journalEntry.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: [{ createdAt: "desc" }],
    });
  }),
});
