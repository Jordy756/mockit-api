import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { JsonObject } from "../../../../domain/entities/Template.js";

export const mocksTable = sqliteTable("mocks", {
  id: text("id").primaryKey(),
  templateId: text("template_id").notNull(),
  data: text("data", { mode: "json" }).$type<JsonObject>().notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export type MockRow = typeof mocksTable.$inferSelect;
