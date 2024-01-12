import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { analyze } from "~/utils/ai";

export const journalRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.journalEntry.create({
        data: {
          content: input.content,
          userId: ctx.user.id,
          analysis: {
            create: await analyze(input.content),
          },
        },
        include: {
          analysis: true,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.journalEntry.findMany({
      where: {
        userId: ctx.user.id,
      },
      include: {
        analysis: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });
  }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.journalEntry.findUniqueOrThrow({
        where: {
          // Using a unique compound index here
          userId_id: {
            id: input.id,
            userId: ctx.user.id,
          },
        },
        include: {
          analysis: true,
        },
      });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string().uuid(), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.journalEntry.update({
        where: {
          // Using a unique compound index again
          userId_id: {
            id: input.id,
            userId: ctx.user.id,
          },
        },
        data: {
          content: input.content,
          analysis: {
            update: await analyze(input.content),
          },
        },
        include: {
          analysis: true,
        },
      });
    }),
});
