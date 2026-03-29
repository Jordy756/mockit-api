import { Mock } from "../../domain/entities/Mock.js";
import { MockRecord } from "../../domain/entities/MockRecord.js";
import type { IMockRecordRepository } from "../../domain/interfaces/repositories/IMockRecordRepository.js";
import { mockRecordTable } from "./sqlite/schema/mockRecordSchema.js";
import { mockTable } from "./sqlite/schema/mockSchema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockRecordRepository implements IMockRecordRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async insert(mockRecord: MockRecord): Promise<MockRecord> {
    const { id, mocks, createdAt, updatedAt } = mockRecord;

    await this.sqliteClient.db.transaction(async (tx) => {
      await tx.insert(mockRecordTable).values({
        id,
        createdAt,
        updatedAt,
      });

      await tx.insert(mockTable).values(
        mocks.map((m) => ({
          id: m.id,
          data: m.data,
          recordId: id,
        })),
      );
    });

    return mockRecord;
  }

  public async getAll(): Promise<MockRecord[]> {
    const records = await this.sqliteClient.db.select().from(mockRecordTable);
    if (records.length === 0) return [];

    const mocks = await this.sqliteClient.db.select().from(mockTable);

    return records.map((record) => {
      const recordMocks = mocks
        .filter((mock) => mock.recordId === record.id)
        .map((m) => new Mock({ id: m.id, data: m.data }));

      return new MockRecord({
        id: record.id,
        mocks: recordMocks,
        createdAt: new Date(record.createdAt),
        updatedAt: new Date(record.updatedAt),
      });
    });
  }
}
