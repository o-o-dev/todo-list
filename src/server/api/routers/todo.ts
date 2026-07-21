import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "todo/server/api/trpc";
import { todos } from "todo/server/db/schema";
import { eq } from "drizzle-orm";

export const todoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(todos)
      .where(eq(todos.userId, ctx.session.user.id));
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
  create: protectedProcedure
    .input(
      z.object({
        content: z
          .string()
          .trim()
          .min(1, "Content Required")
          .max(256, "Todo is too long"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [todo] = await ctx.db
        .insert(todos)
        .values({ content: input.content, userId: ctx.session.user.id })
        .returning();

      return todo;
    }),
});
