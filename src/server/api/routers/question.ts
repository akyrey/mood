import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { qa } from "~/utils/ai";

export const questionRouter = createTRPCRouter({
  ask: protectedProcedure
    .input(z.object({ question: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const entries = await ctx.db.journalEntry.findMany({
        where: {
          userId: ctx.user.id,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      });

      return await qa(input.question, entries);
    }),
});
