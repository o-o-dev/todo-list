import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "todo/server/api/trpc";

export const todoRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return {
      status: "up and running",
    };
  }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.todos.findMany();
  }),
});
