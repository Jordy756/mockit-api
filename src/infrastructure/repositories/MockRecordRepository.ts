import { injectable, inject } from "inversify";
import { Mock } from "../../domain/entities/Mock.js";
import { MockRecord } from "../../domain/entities/MockRecord.js";
import type { IMockRecordRepository } from "../../domain/interfaces/repositories/IMockRecordRepository.js";
import { mockRecordTable } from "./sqlite/schema/mockRecordSchema.js";
import { mockTable } from "./sqlite/schema/mockSchema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";
import { TYPES } from "../di/types.js";

@injectable()
export class MockRecordRepository implements IMockRecordRepository {
  constructor(@inject(TYPES.SqliteClient) private readonly sqliteClient: SqliteClient) {}

  public async insert(mockRecord: MockRecord): Promise<MockRecord> {
    const { id, mocks, createdAt, updatedAt } = mockRecord;

    this.sqliteClient.db.transaction((tx) => {
      tx.insert(mockRecordTable)
        .values({
          id,
          createdAt,
          updatedAt,
        })
        .run();

      if (mocks.length === 0) return;

      tx.insert(mockTable)
        .values(
          mocks.map((mock) => ({
            id: mock.id,
            data: mock.data,
            recordId: id,
          })),
        )
        .run();
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
        .map((mock) => new Mock({ id: mock.id, data: mock.data }));

      return new MockRecord({
        id: record.id,
        mocks: recordMocks,
        createdAt: new Date(record.createdAt),
        updatedAt: new Date(record.updatedAt),
      });
    });
  }
}
