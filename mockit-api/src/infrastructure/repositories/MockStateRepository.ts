import { eq } from "drizzle-orm";

import type { JsonValue } from "../../domain/entities/Template.js";
import type {
  IMockStateRepository,
  MockStateRecord,
} from "../../domain/interfaces/repositories/IMockStateRepository.js";
import { mockStatesTable, type MockStateRow } from "./sqlite/schema/mock-state.schema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockStateRepository implements IMockStateRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async getBySimulationId(mockId: string): Promise<MockStateRecord | null> {
    const rows = await this.sqliteClient.db
      .select()
      .from(mockStatesTable)
      .where(eq(mockStatesTable.mockId, mockId))
      .limit(1);

    const row = rows[0];
    return row === undefined ? null : this.toRecord(row);
  }

  public async upsertBySimulationId(mockId: string, state: JsonValue): Promise<MockStateRecord> {
    const now = new Date();

    const existing = await this.getBySimulationId(mockId);

    if (existing === null) {
      const inserted = await this.sqliteClient.db
        .insert(mockStatesTable)
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
      .update(mockStatesTable)
      .set({
        state,
        updatedAt: now,
      })
      .where(eq(mockStatesTable.mockId, mockId))
      .returning();

    const row = updated[0];

    if (row === undefined) {
      throw new Error("Failed to update simulation state");
    }

    return this.toRecord(row);
  }

  public async deleteBySimulationId(mockId: string): Promise<boolean> {
    const rows = await this.sqliteClient.db
      .delete(mockStatesTable)
      .where(eq(mockStatesTable.mockId, mockId))
      .returning({ mockId: mockStatesTable.mockId });

    return rows[0] !== undefined;
  }

  private toRecord(row: MockStateRow): MockStateRecord {
    return {
      mockId: row.mockId,
      state: row.state,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
