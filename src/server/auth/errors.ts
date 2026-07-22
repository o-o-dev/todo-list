import { TRPCError } from "@trpc/server";

export const trpcErrors = {
  usernameTaken: () => {
    return new TRPCError({
      code: "CONFLICT",
      message: "Username is already taken",
    });
  },
  database: () => {
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database error",
    });
  },

  notFound: (message: string) => {
    return new TRPCError({
      code: "NOT_FOUND",
      message: message,
    });
  },
  internalError: (message: string) => {
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: message,
    });
  },
  authenticationError: () => {
    return new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not Authorized",
    });
  },
  badRequest: (message: string) => {
    return new TRPCError({
      code: "BAD_REQUEST",
      message: message,
    });
  },
};
