import { eq } from "drizzle-orm";
import { Mock } from "../../domain/entities/Mock.js";
import { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { mockTable } from "./sqlite/schema/mockSchema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockRepository implements IMockRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async insert(mockId: string, mock: Mock): Promise<Mock> {
    const { data } = mock;
    const existingRows = await this.sqliteClient.db
      .select({ id: mockTable.id, data: mockTable.data })
      .from(mockTable)
      .where(eq(mockTable.id, mockId))
      .limit(1);

    if (existingRows.length > 0) {
      const existingData = existingRows[0].data;
      const currentData = Array.isArray(existingData) ? existingData : [existingData];
      const mergedData = [...currentData, data];

      await this.sqliteClient.db
        .update(mockTable)
        .set({
          data: mergedData,
        })
        .where(eq(mockTable.id, mockId));

      return mock;
    }

    await this.sqliteClient.db.insert(mockTable).values({
      id: mockId,
      recordId: mockId,
      data: [data],
    });

    return mock;
  }

  public async getAll(mockId: string): Promise<Mock[]> {
    const rows = await this.sqliteClient.db.select().from(mockTable).where(eq(mockTable.recordId, mockId));

    return rows.length === 0 ? [] : rows.map(({ id, data }) => new Mock({ id, data }));
  }
}
