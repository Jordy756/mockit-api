import { Mock } from "../../domain/entities/Mock.js";
import { MockRecord } from "../../domain/entities/MockRecord.js";
import type { IMockRecordRepository } from "../../domain/interfaces/repositories/IMockRecordRepository.js";
import { mockTable, type MockRow } from "./sqlite/schema/mock.schema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockRecordRepository implements IMockRecordRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async insert(mockRecord: MockRecord): Promise<MockRecord> {
    const { id, mock, createdAt, updatedAt } = mockRecord;
    await this.sqliteClient.db.insert(mockTable).values({
      id,
      data: mock.data as unknown as Record<string, unknown>,
      createdAt,
      updatedAt,
    });

    return mockRecord;
  }

  public async getAll(): Promise<MockRecord[]> {
    const rows = await this.sqliteClient.db.select().from(mockTable);
    return rows.map((row) => this.toDomain(row));
  }

  private toDomain({ id, data, createdAt, updatedAt }: MockRow): MockRecord {
    return new MockRecord({
      id,
      mock: new Mock(Array.isArray(data) ? data : [data]),
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
    });
  }
}
