import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "todo/server/api/trpc";

export const signUpRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return {
      status: "signed up!",
    };
  }),
});
