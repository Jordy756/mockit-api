import { eq, and } from "drizzle-orm";
import { injectable, inject } from "inversify";
import { Mock } from "../../domain/entities/Mock.js";
import { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { mockTable } from "./sqlite/schema/mockSchema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";
import { TYPES } from "../di/types.js";

@injectable()
export class MockRepository implements IMockRepository {
  constructor(@inject(TYPES.SqliteClient) private readonly sqliteClient: SqliteClient) {}

  public async insert(mockRecordId: string, mock: Mock): Promise<Mock> {
    const { id, data } = mock;

    await this.sqliteClient.db.insert(mockTable).values({
      id: id,
      recordId: mockRecordId,
      data: data,
    });

    return mock;
  }

  public async update(mockRecordId: string, mockId: string, mock: Mock): Promise<Mock> {
    const rows = await this.sqliteClient.db
      .update(mockTable)
      .set({ data: mock.data })
      .where(and(eq(mockTable.id, mockId), eq(mockTable.recordId, mockRecordId)))
      .returning({ id: mockTable.id, data: mockTable.data });

    if (rows.length === 0) throw new Error("Mock not found");

    return mock;
  }

  public async patch(mockRecordId: string, mockId: string, mock: Mock): Promise<Mock> {
    const existing = await this.sqliteClient.db
      .select({ data: mockTable.data })
      .from(mockTable)
      .where(and(eq(mockTable.id, mockId), eq(mockTable.recordId, mockRecordId)))
      .limit(1);

    if (existing.length === 0) throw new Error("Mock not found");

    const mergedData = {
      ...(existing[0].data as Record<string, unknown>),
      ...mock.data,
    };

    await this.sqliteClient.db
      .update(mockTable)
      .set({ data: mergedData })
      .where(and(eq(mockTable.id, mockId), eq(mockTable.recordId, mockRecordId)))
      .returning({ id: mockTable.id, data: mockTable.data });

    return mock;
  }

  public async delete(mockRecordId: string, mockId: string): Promise<boolean> {
    const rows = await this.sqliteClient.db
      .delete(mockTable)
      .where(and(eq(mockTable.id, mockId), eq(mockTable.recordId, mockRecordId)))
      .returning({ id: mockTable.id });

    return rows.length > 0;
  }

  public async getById(mockRecordId: string, mockId: string): Promise<Mock | null> {
    const rows = await this.sqliteClient.db
      .select({ id: mockTable.id, data: mockTable.data })
      .from(mockTable)
      .where(and(eq(mockTable.id, mockId), eq(mockTable.recordId, mockRecordId)))
      .limit(1);

    if (rows.length === 0) return null;

    return new Mock(rows[0]);
  }

  public async getAll(mockRecordId: string): Promise<Mock[]> {
    const rows = await this.sqliteClient.db.select().from(mockTable).where(eq(mockTable.recordId, mockRecordId));

    return rows.length === 0 ? [] : rows.map(({ id, data }) => new Mock({ id, data }));
  }
}
