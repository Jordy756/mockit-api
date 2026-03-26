import { randomUUID } from "node:crypto";

import { Mock } from "../../domain/entities/Mock.js";
import type { MockDefinitionProps, NewMockDefinitionProps } from "../../domain/entities/Mock.js";
import type { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { mockDefinitionsTable, type MockDefinitionRow } from "./sqlite/schema/mock.schema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockRepository implements IMockRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async register(input: NewMockDefinitionProps) {
    const mockId = randomUUID();
    const now = new Date();

    const rows = await this.sqliteClient.db
      .insert(mockDefinitionsTable)
      .values({
        name: mockId,
        method: "GET",
        path: `/api/mocks/${mockId}`,
        statusCode: 200,
        responseBody: input.payload,
        headers: {},
        delayMs: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now,
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
    const props: MockDefinitionProps = {
      id: row.name,
      payload: row.responseBody,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };

    return new Mock(props);
  }
}
