import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "todo/server/api/trpc";
import { users } from "todo/server/db/schema";
import { eq } from "drizzle-orm";

import bcrypt from "bcryptjs";
import { trpcErrors } from "todo/server/auth/errors";
import { TRPCError } from "@trpc/server";

const SALT_ROUNDS = 10;

const signupSchema = z.object({
  username: z
    .string()
    .min(8, { message: "Username must be longer than 7 characters" })
    .max(255)
    .trim(),
  password: z
    .string()
    .min(8, { message: "Password must be longer than 7 characters" })
    .max(255)
    .trim(),
});

export const signUpRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return {
      status: "signed up!",
    };
  }),
  signup: publicProcedure
    .input(signupSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const [usernameExist] = await ctx.db
          .select()
          .from(users)
          .where(eq(users.username, input.username))
          .limit(1);

        if (usernameExist) {
          throw trpcErrors.usernameTaken();
        }

        const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
        const [new_user] = await ctx.db
          .insert(users)
          .values({ username: input.username, password: hashedPassword })
          .returning({
            insertedId: users.id,
            insertedUsername: users.username,
          });
        return new_user;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw trpcErrors.database();
      }
    }),
});
