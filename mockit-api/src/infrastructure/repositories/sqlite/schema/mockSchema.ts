import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { mockRecordTable } from "./mockRecordSchema.js";

export const mockTable = sqliteTable("MOCKS", {
  id: text("ID").primaryKey(),
  recordId: text("RECORD_ID").references(() => mockRecordTable.id, { onDelete: "cascade" }),
  data: text("DATA", { mode: "json" }).$type<any>().notNull(),
  createdAt: integer("CREATED_AT", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("UPDATED_AT", { mode: "timestamp_ms" }).notNull(),
});

export type MockRow = typeof mockTable.$inferSelect;
