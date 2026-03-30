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
    const rows = await this.sqliteClient.db.select().from(mockTable).where(eq(mockTable.recordId, recordId));

    return rows.length === 0 ? [] : rows.map(({ id, data }) => new Mock({ id, data }));
  }
}
