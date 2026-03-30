import { eq } from "drizzle-orm";
import { Mock } from "../../domain/entities/Mock.js";
import { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { mockTable } from "./sqlite/schema/mockSchema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockRepository implements IMockRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async insert(mockRecordId: string, mock: Mock): Promise<Mock> {
    const { id, data } = mock;

    await this.sqliteClient.db.insert(mockTable).values({
      id: id,
      recordId: mockRecordId,
      data: data,
    });

    return mock;
  }

  public async update(mockId: string, mock: Mock): Promise<Mock> {
    const rows = await this.sqliteClient.db
      .update(mockTable)
      .set({ data: mock.data })
      .where(eq(mockTable.id, mockId))
      .returning({ id: mockTable.id, data: mockTable.data });

    if (rows.length === 0) throw new Error("Mock not found");

    return mock;
  }

  public async patch(mockId: string, mock: Mock): Promise<Mock> {
    const existing = await this.sqliteClient.db
      .select({ data: mockTable.data })
      .from(mockTable)
      .where(eq(mockTable.id, mockId))
      .limit(1);

    if (existing.length === 0) throw new Error("Mock not found");

    const mergedData = {
      ...(existing[0].data as Record<string, unknown>),
      ...mock.data,
    };

    await this.sqliteClient.db
      .update(mockTable)
      .set({ data: mergedData })
      .where(eq(mockTable.id, mockId))
      .returning({ id: mockTable.id, data: mockTable.data });

    return mock;
  }

  public async delete(mockId: string): Promise<boolean> {
    const rows = await this.sqliteClient.db
      .delete(mockTable)
      .where(eq(mockTable.id, mockId))
      .returning({ id: mockTable.id });

    return rows.length > 0;
  }

  public async getAll(recordId: string): Promise<Mock[]> {
    const rows = await this.sqliteClient.db.select().from(mockTable).where(eq(mockTable.recordId, recordId));

    return rows.length === 0 ? [] : rows.map(({ id, data }) => new Mock({ id, data }));
  }
}
