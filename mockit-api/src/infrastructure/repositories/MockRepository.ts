import { eq } from "drizzle-orm";
import { Mock } from "../../domain/entities/Mock.js";
import { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { mockTable } from "./sqlite/schema/mockSchema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockRepository implements IMockRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async insert(recordId: string, mock: Mock): Promise<Mock> {
    const { id, data } = mock;

    await this.sqliteClient.db.insert(mockTable).values({
      id: id,
      recordId: recordId,
      data: data,
    });

    return mock;
  }

  public async getAll(recordId: string): Promise<Mock[]> {
    const rows = await this.sqliteClient.db
      .select()
      .from(mockTable)
      .where(eq(mockTable.recordId, recordId));

    return rows.length === 0
      ? []
      : rows.map(({ id, data }) => new Mock({ id, data }));
  }

  public async update(
    mockId: string,
    data: Record<string, unknown>,
  ): Promise<Mock> {
    const rows = await this.sqliteClient.db
      .update(mockTable)
      .set({ data })
      .where(eq(mockTable.id, mockId))
      .returning({ id: mockTable.id, data: mockTable.data });

    if (rows.length === 0) throw new Error("Mock not found");
    return new Mock({ id: rows[0].id, data: rows[0].data });
  }

  public async patch(
    mockId: string,
    partialData: Record<string, unknown>,
  ): Promise<Mock> {
    const existing = await this.sqliteClient.db
      .select({ data: mockTable.data })
      .from(mockTable)
      .where(eq(mockTable.id, mockId))
      .limit(1);

    if (existing.length === 0) throw new Error("Mock not found");

    const mergedData = {
      ...(existing[0].data as Record<string, unknown>),
      ...partialData,
    };

    const rows = await this.sqliteClient.db
      .update(mockTable)
      .set({ data: mergedData })
      .where(eq(mockTable.id, mockId))
      .returning({ id: mockTable.id, data: mockTable.data });

    return new Mock({ id: rows[0].id, data: rows[0].data });
  }

  public async delete(mockId: string): Promise<boolean> {
    const rows = await this.sqliteClient.db
      .delete(mockTable)
      .where(eq(mockTable.id, mockId))
      .returning({ id: mockTable.id });

    return rows.length > 0;
  }
}
