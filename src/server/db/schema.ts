import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `todo-list_${name}`);

export const users = createTable("users", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: d.varchar({ length: 255 }).notNull().unique(),
  password: d.varchar({ length: 255 }).notNull(),
  createdAt: d
    .timestamp({ mode: "date", precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
}));

export const todos = createTable(
  "todos",
  (d) => ({
    id: d
      .varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    content: d.text().notNull(),
    isCompleted: d.boolean().notNull().default(false),
    createdAt: d
      .timestamp({ mode: "date", precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: d
      .timestamp({ mode: "date", precision: 6, withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categoryId: d
      .varchar({ length: 255 })
      .references(() => categories.id, { onDelete: "set null" }),
  }),
  (table) => [index("todos_user_id_idx").on(table.userId)],
);

export const categories = createTable("categories", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }).notNull(),
  color: d.varchar({ length: 7 }),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
}));
