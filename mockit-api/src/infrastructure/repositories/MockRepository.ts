import { Mock } from "../../domain/entities/Mock.js";
import { eq } from "drizzle-orm";
import { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { mockTable, type MockRow } from "./sqlite/schema/mock.schema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockRepository implements IMockRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async insert(mockId: string, { data }: Mock): Promise<Mock> {
    // 1. Primero buscar el mock con el id
    const existingRows = await this.sqliteClient.db
      .select({ id: mockTable.id })
      .from(mockTable)
      .where(eq(mockTable.id, mockId))
      .limit(1);

    throw new Error("Mock with the same id already exists");
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
