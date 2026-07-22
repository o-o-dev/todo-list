import { categories } from "todo/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { trpcErrors } from "todo/server/auth/errors";
import { and, eq } from "drizzle-orm";

const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(1, "Must add color name"),
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
        .set({ id: input.id, name: input.name, color: input.color })
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
    }),
});
