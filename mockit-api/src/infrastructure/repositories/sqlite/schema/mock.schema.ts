import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const mockTable = sqliteTable("MOCK", {
  id: text("ID").primaryKey(),
  data: text("DATA", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
  createdAt: integer("CREATED_AT", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("UPDATED_AT", { mode: "timestamp_ms" }).notNull(),
});

export type MockRow = typeof mockTable.$inferSelect;
