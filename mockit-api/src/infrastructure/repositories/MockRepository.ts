import { Mock } from "../../domain/entities/Mock.js";
import { eq } from "drizzle-orm";
import { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { mockTable } from "./sqlite/schema/mock.schema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockRepository implements IMockRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async insert(mockId: string, { data }: Mock): Promise<Mock> {
    const existingRows = await this.sqliteClient.db
      .select({ id: mockTable.id, data: mockTable.data })
      .from(mockTable)
      .where(eq(mockTable.id, mockId))
      .limit(1);

    if (existingRows.length > 0) {
      const existingData = existingRows[0].data;
      const currentData = Array.isArray(existingData) ? existingData : [existingData];
      const mergedData = [...currentData, ...data];

      await this.sqliteClient.db
        .update(mockTable)
        .set({
          data: mergedData as unknown as Record<string, unknown>,
          updatedAt: new Date(),
        })
        .where(eq(mockTable.id, mockId));

      return new Mock(mergedData as Record<string, unknown>[]);
    }

    const now = new Date();
    await this.sqliteClient.db.insert(mockTable).values({
      id: mockId,
      data: data as unknown as Record<string, unknown>,
      createdAt: now,
      updatedAt: now,
    });

    return new Mock(data);
  }

  public async getAll(mockId: string): Promise<Mock> {
    const rows = await this.sqliteClient.db.select().from(mockTable).where(eq(mockTable.id, mockId));

    if (rows.length === 0) {
      return new Mock([]);
    }

    const firstRowData = rows[0].data;
    const mockData = Array.isArray(firstRowData) ? firstRowData : [firstRowData];

    return new Mock(mockData as Record<string, unknown>[]);
  }
}
