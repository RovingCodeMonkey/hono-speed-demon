import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  githubId: text("github_id").notNull().unique(),
  email: text("email").unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  // mode: 'timestamp' handles JS Date objects automatically
  createdAt: integer("created_at", { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`), 
  updatedAt: integer("updated_at", { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
}, (table) => [
  uniqueIndex("email_idx").on(table.email),
]);
