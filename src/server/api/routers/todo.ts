import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "todo/server/api/trpc";
import { todos } from "todo/server/db/schema";
import { eq, and } from "drizzle-orm";

import { trpcErrors } from "todo/server/auth/errors";

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
        .where(
          and(eq(todos.id, input.id), eq(todos.userId, ctx.session.user.id)),
        )
        .limit(1);

      if (!todo) {
        throw trpcErrors.notFound("Todo Not Found");
      }

      const newVal = !todo.isCompleted;

      await ctx.db
        .update(todos)
        .set({ isCompleted: newVal })
        .where(eq(todos.id, input.id));

      return { id: input.id, isCompleted: newVal };
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(todos)
        .where(
          and(eq(todos.id, input.id), eq(todos.userId, ctx.session.user.id)),
        )
        .returning({ id: todos.id });
      if (result.length === 0) {
        throw trpcErrors.notFound("Todo not found");
      }
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

      if (!todo) {
        throw trpcErrors.internalError("Error Creating Todo");
      }

      return todo;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z
          .string()
          .trim()
          .min(1, "Content Required")
          .max(256, "Todo is too long"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(todos)
        .set({ content: input.content })
        .where(
          and(eq(todos.id, input.id), eq(todos.userId, ctx.session.user.id)),
        )
        .returning({ id: todos.id });
      if (result.length === 0) {
        throw trpcErrors.notFound("Todo not Found");
      }
      return { id: input.id };
    }),
});
