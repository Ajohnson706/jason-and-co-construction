import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  projectType: text("project_type").notNull(),
  timeline: text("timeline").notNull().default(""),
  details: text("details").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
