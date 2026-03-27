import { eq } from "drizzle-orm";

import type { JsonValue } from "../../domain/entities/Template.js";
import type { IMockRepository, MockStateRecord } from "../../domain/interfaces/repositories/IMockRepository.js";
import { mockTable, type MockRow } from "./sqlite/schema/mock.schema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockRepository implements IMockRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async getBySimulationId(mockId: string): Promise<MockStateRecord | null> {
    const rows = await this.sqliteClient.db.select().from(mockTable).where(eq(mockTable.mockId, mockId)).limit(1);

    const row = rows[0];
    return row === undefined ? null : this.toRecord(row);
  }

  public async upsertBySimulationId(mockId: string, state: JsonValue): Promise<MockStateRecord> {
    const now = new Date();

    const existing = await this.getBySimulationId(mockId);

    if (existing === null) {
      const inserted = await this.sqliteClient.db
        .insert(mockTable)
        .values({
          mockId,
          state,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      const row = inserted[0];

      if (row === undefined) {
        throw new Error("Failed to persist simulation state");
      }

      return this.toRecord(row);
    }

    const updated = await this.sqliteClient.db
      .update(mockTable)
      .set({
        state,
        updatedAt: now,
      })
      .where(eq(mockTable.mockId, mockId))
      .returning();

    const row = updated[0];

    if (row === undefined) {
      throw new Error("Failed to update simulation state");
    }

    return this.toRecord(row);
  }

  public async deleteBySimulationId(mockId: string): Promise<boolean> {
    const rows = await this.sqliteClient.db
      .delete(mockTable)
      .where(eq(mockTable.mockId, mockId))
      .returning({ mockId: mockTable.mockId });

    return rows[0] !== undefined;
  }

  private toRecord(row: MockRow): MockStateRecord {
    return {
      mockId: row.mockId,
      state: row.state,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
