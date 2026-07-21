import { TRPCError } from "@trpc/server";

export const trpcErrors = {
  usernameTaken: () =>
    new TRPCError({
      code: "CONFLICT",
      message: "Username is already taken",
    }),
  database: () =>
    new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database error",
    }),
};
