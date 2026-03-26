import { Mock } from "../../domain/entities/Mock.js";
import type { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { mockDefinitionsTable, type MockDefinitionRow } from "./sqlite/schema/mock.schema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockRepository implements IMockRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async register(mock: Mock) {
    const rows = await this.sqliteClient.db
      .insert(mockDefinitionsTable)
      .values({
        id: mock.id,
        payload: mock.payload,
        createdAt: mock.createdAt,
        updatedAt: mock.updatedAt,
      })
      .returning();

    const row = rows[0];

    if (row === undefined) {
      throw new Error("Failed to persist mock definition");
    }

    return this.toDomain(row);
  }

  public async list() {
    const rows = await this.sqliteClient.db.select().from(mockDefinitionsTable);
    return rows.map((row) => this.toDomain(row));
  }

  private toDomain(row: MockDefinitionRow) {
    const mock = new Mock(row.payload);
    // Reconstruct from DB data with persisted timestamps and id
    return Object.assign(mock, {
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }) as Mock;
  }
}
