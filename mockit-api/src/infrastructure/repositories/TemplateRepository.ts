import { Mock } from "../../domain/entities/Mock.js";
import type { IMockRecordRepository } from "../../domain/interfaces/repositories/IMockRecordRepository.js";
import { mockTable, type MockRow } from "./sqlite/schema/mock.schema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class TemplateRepository implements IMockRecordRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async insert({ id, data, createdAt, updatedAt }: Mock): Promise<Mock> {
    const rows = await this.sqliteClient.db
      .insert(mockTable)
      .values({
        id,
        data,
        createdAt,
        updatedAt,
      })
      .returning();

    const row = rows[0];

    if (row === undefined) throw new Error("Failed to persist template row");

    return this.toDomain(row);
  }

  public async getAll(): Promise<Mock[]> {
    const rows = await this.sqliteClient.db.select().from(mockTable);
    return rows.map((row) => this.toDomain(row));
  }

  private toDomain({ id, data, createdAt, updatedAt }: MockRow): Mock {
    return new Mock({
      id,
      data,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
    });
  }
}
