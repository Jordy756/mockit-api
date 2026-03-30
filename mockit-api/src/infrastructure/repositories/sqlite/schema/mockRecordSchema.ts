import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const mockRecordTable = sqliteTable("MOCK_RECORDS", {
  id: text("ID").primaryKey(),
  createdAt: integer("CREATED_AT", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("UPDATED_AT", { mode: "timestamp_ms" }).notNull(),
});

export type MockRecordRow = typeof mockRecordTable.$inferSelect;
