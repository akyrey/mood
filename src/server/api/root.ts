import { createTRPCRouter } from "~/server/api/trpc";
import { journalRouter } from "./routers/journal";
import { questionRouter } from "./routers/question";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  journal: journalRouter,
  question: questionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
