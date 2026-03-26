import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import type { JsonValue } from "../../../../domain/entities/Mock.js";

export const mockDefinitionsTable = sqliteTable(
  "mock_definitions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    method: text("method").notNull(),
    path: text("path").notNull(),
    statusCode: integer("status_code").notNull(),
    responseBody: text("response_body", { mode: "json" }).$type<JsonValue>().notNull(),
    headers: text("headers", { mode: "json" }).$type<Record<string, string>>().notNull(),
    delayMs: integer("delay_ms").notNull().default(0),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => ({
    methodPathUniqueIdx: uniqueIndex("mock_method_path_unique_idx").on(table.method, table.path),
    nameUniqueIdx: uniqueIndex("mock_name_unique_idx").on(table.name),
  }),
);

export type MockDefinitionRow = typeof mockDefinitionsTable.$inferSelect;
