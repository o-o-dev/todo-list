import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "todo/server/api/trpc";
import { todos } from "todo/server/db/schema";
import { eq, textDecoder } from "drizzle-orm";

export const todoRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return {
      status: "up and running",
    };
  }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.todos.findMany();
  }),
  toggle: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [todo] = await ctx.db
        .select()
        .from(todos)
        .where(eq(todos.id, input.id))
        .limit(1);
      const newVal = !todo?.isCompleted;

      await ctx.db
        .update(todos)
        .set({ isCompleted: newVal })
        .where(eq(todos.id, input.id));

      return { id: input.id, isCompleted: newVal };
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(todos).where(eq(todos.id, input.id));
      return { id: input.id };
    }),
});
