import { Mock } from "../../domain/entities/Mock.js";
import { eq } from "drizzle-orm";
import { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { mockTable } from "./sqlite/schema/mockSchema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";
import { randomUUID } from "node:crypto";

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
          updatedAt: new Date(),
        })
        .where(eq(mockTable.id, mockId));

      return mock;
    }

    const now = new Date();
    await this.sqliteClient.db.insert(mockTable).values({
      id: mockId,
      data: [data],
      createdAt: now,
      updatedAt: now,
    });

    return mock;
  }

  public async getAll(mockId: string): Promise<Mock[]> {
    const rows = await this.sqliteClient.db.select().from(mockTable).where(eq(mockTable.id, mockId));

    if (rows.length === 0) {
      return [];
    }

    const firstRowData = rows[0].data;
    const mockData = Array.isArray(firstRowData) ? firstRowData : [firstRowData];

    return mockData.map((d) => new Mock({ id: randomUUID(), data: d as Record<string, unknown> }));
  }
}
