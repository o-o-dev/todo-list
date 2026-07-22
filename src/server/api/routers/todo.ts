import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "todo/server/api/trpc";
import { todos, categories } from "todo/server/db/schema";
import { eq, and, inArray, sql } from "drizzle-orm";

import { trpcErrors } from "todo/server/auth/errors";

export const todoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: todos.id,
        content: todos.content,
        isCompleted: todos.isCompleted,
        createdAt: todos.createdAt,
        updatedAt: todos.updatedAt,
        categoryId: todos.categoryId,
        category: {
          id: categories.id,
          name: categories.name,
          color: categories.color,
        },
      })
      .from(todos)
      .leftJoin(categories, eq(todos.categoryId, categories.id))
      .where(eq(todos.userId, ctx.session.user.id))
      .orderBy(todos.createdAt);
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
        .where(
          and(eq(todos.id, input.id), eq(todos.userId, ctx.session.user.id)),
        );

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
        categoryId: z.string().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [todo] = await ctx.db
        .insert(todos)
        .values({
          content: input.content,
          userId: ctx.session.user.id,
          categoryId: input.categoryId ?? null,
        })
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
        categoryId: z.string().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(todos)
        .set({
          content: input.content,
          categoryId: input.categoryId ?? null,
        })
        .where(
          and(eq(todos.id, input.id), eq(todos.userId, ctx.session.user.id)),
        )
        .returning({ id: todos.id });
      if (result.length === 0) {
        throw trpcErrors.notFound("Todo not Found");
      }
      return { id: input.id };
    }),
  batch: protectedProcedure
    .input(
      z.object({
        updates: z.array(
          z.object({
            id: z.string(),
            content: z
              .string()
              .trim()
              .min(1, "Must add Content")
              .max(256, "Todo too long")
              .optional(),
            categoryId: z.string().nullish(),
          }),
        ),
        deleteIds: z.array(z.string()),
        toggleIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (
        input.updates.length === 0 &&
        input.deleteIds.length === 0 &&
        input.toggleIds.length === 0
      ) {
        return { success: true, updateCount: 0, deleteCount: 0 };
      }

      const deleteSet = new Set(input.deleteIds);
      const toggleDeleteDups = input.toggleIds.filter((id) =>
        deleteSet.has(id),
      );
      if (toggleDeleteDups.length > 0) {
        throw trpcErrors.badRequest("Cannot toggle and delete the same item");
      }

      let updateCount = 0;
      let deleteCount = 0;
      try {
        await ctx.db.transaction(async (tx) => {
          for (const update of input.updates) {
            const setData: { content?: string; categoryId?: string | null } = {};
            if (update.content !== undefined) setData.content = update.content;
            if (update.categoryId !== undefined) setData.categoryId = update.categoryId ?? null;

            if (Object.keys(setData).length > 0) {
              const result = await tx
                .update(todos)
                .set(setData)
                .where(and(eq(todos.id, update.id), eq(todos.userId, userId)))
                .returning({ id: todos.id });
              updateCount += result.length;
            }
          }

          if (input.deleteIds.length > 0) {
            const result = await tx
              .delete(todos)
              .where(
                and(
                  inArray(todos.id, input.deleteIds),
                  eq(todos.userId, userId),
                ),
              )
              .returning({ id: todos.id });
            deleteCount = result.length;
          }
          if (input.toggleIds.length > 0) {
            await tx
              .update(todos)
              .set({ isCompleted: sql`NOT ${todos.isCompleted}` })
              .where(
                and(
                  inArray(todos.id, input.toggleIds),
                  eq(todos.userId, userId),
                ),
              );
          }
        });
      } catch (error) {
        throw trpcErrors.internalError("Batch operation Failed");
      }

      return { success: true, updateCount, deleteCount };
    }),
});
