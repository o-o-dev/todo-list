import { todoRouter } from "todo/server/api/routers/todo";
import { categoryRouter } from "todo/server/api/routers/categories";
import { signUpRouter } from "todo/server/api/routers/auth";
import { createCallerFactory, createTRPCRouter } from "todo/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  todo: todoRouter,
  signup: signUpRouter,
  category: categoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
