import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { JsonValue } from "../../../../domain/entities/Template.js";

export const mockStatesTable = sqliteTable("mock_states", {
  mockId: text("mock_id").primaryKey(),
  state: text("state", { mode: "json" }).$type<JsonValue>().notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export type MockStateRow = typeof mockStatesTable.$inferSelect;
