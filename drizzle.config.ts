import { type Config } from "drizzle-kit";

import { env } from "todo/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["todo-list_*"],
} satisfies Config;
