import { text, integer } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";

import type { JsonValue } from "../../../../domain/entities/Mock.js";

export const mockDefinitionsTable = sqliteTable("mock_definitions", {
  id: text("id").primaryKey(),
  payload: text("payload", { mode: "json" }).$type<JsonValue>().notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export type MockDefinitionRow = typeof mockDefinitionsTable.$inferSelect;
