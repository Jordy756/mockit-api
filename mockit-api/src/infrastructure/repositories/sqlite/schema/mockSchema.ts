import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { mockRecordTable } from "./mockRecordSchema.js";

export const mockTable = sqliteTable("MOCKS", {
  id: text("ID").primaryKey(),
  data: text("DATA", { mode: "json" }).$type<any>().notNull(),
  recordId: text("RECORD_ID").references(() => mockRecordTable.id, { onDelete: "cascade" }),
});

export type MockRow = typeof mockTable.$inferSelect;
