import { categories } from "todo/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { trpcErrors } from "todo/server/auth/errors";
import { and, eq } from "drizzle-orm";

export const categoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(categories)
      .where(eq(categories.userId, ctx.session.user.id));
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(1, "Must add category"),
        color: z.string().trim().min(1, "Must add color"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(categories)
        .values({
          name: input.name,
          color: input.color,
          userId: ctx.session.user.id,
        })
        .returning();

      if (!result) {
        throw trpcErrors.internalError("Error Creating category");
      }

      return result;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .delete(categories)
        .where(
          and(
            eq(categories.id, input.id),
            eq(categories.userId, ctx.session.user.id),
          ),
        )
        .returning();

      if (!result) {
        throw trpcErrors.notFound("Category not found");
      }

      return result;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).trim(),
        color: z.string().min(1).trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .update(categories)
        .set({ name: input.name, color: input.color })
        .where(
          and(
            eq(categories.id, input.id),
            eq(categories.userId, ctx.session.user.id),
          ),
        )
        .returning();

      if (!result) {
        throw trpcErrors.notFound("Category not found");
      }
      return result;
    }),
});
