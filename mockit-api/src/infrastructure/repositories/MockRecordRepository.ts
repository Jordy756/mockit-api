import { Mock } from "../../domain/entities/Mock.js";
import { MockRecord } from "../../domain/entities/MockRecord.js";
import type { IMockRecordRepository } from "../../domain/interfaces/repositories/IMockRecordRepository.js";
import { mockTable, type MockRow } from "./sqlite/schema/mock.schema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockRecordRepository implements IMockRecordRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async insert({ id, mock, createdAt, updatedAt }: MockRecord): Promise<MockRecord> {
    const rows = await this.sqliteClient.db
      .insert(mockTable)
      .values({
        id,
        data: mock.data,
        createdAt,
        updatedAt,
      })
      .returning();

    const row = rows[0];

    if (row === undefined) throw new Error("Failed to persist mock record row");

    return this.toDomain(row);
  }

  public async getAll(): Promise<MockRecord[]> {
    const rows = await this.sqliteClient.db.select().from(mockTable);
    return rows.map((row) => this.toDomain(row));
  }

  private toDomain({ id, data, createdAt, updatedAt }: MockRow): MockRecord {
    return new MockRecord({
      id,
      mock: new Mock(data),
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
    });
  }
}
