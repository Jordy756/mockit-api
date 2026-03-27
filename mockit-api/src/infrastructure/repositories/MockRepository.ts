import { Mock } from "../../domain/entities/Mock.js";
import type { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { mockTable, type MockRow } from "./sqlite/schema/mock.schema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockRepository implements IMockRepository {
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

    if (row === undefined) throw new Error("Failed to persist mock row");

    return this.toDomain(row);
  }

  public async getAll(): Promise<Mock[]> {
    const rows = await this.sqliteClient.db.select().from(mockTable);
    return rows.map((row) => this.toDomain(row));
  }

  private toDomain({ id, data, createdAt, updatedAt }: MockRow): Mock {
    const mock = new Mock(data);
    return Object.assign(mock, {
      id,
      data,
      createdAt,
      updatedAt,
    });
  }
}
