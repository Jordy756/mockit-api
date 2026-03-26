import { and, eq } from "drizzle-orm";

import { MockDefinition } from "../../domain/entities/Mock.js";
import type { HttpMethod, MockDefinitionProps, NewMockDefinitionProps } from "../../domain/entities/Mock.js";
import type { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { mockDefinitionsTable, type MockDefinitionRow } from "./sqlite/schema/mock.schema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class DrizzleMockRepository implements IMockRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async create(input: NewMockDefinitionProps) {
    const now = new Date();

    const rows = await this.sqliteClient.db
      .insert(mockDefinitionsTable)
      .values({
        name: input.name,
        method: input.method,
        path: input.path,
        statusCode: input.statusCode,
        responseBody: input.responseBody,
        headers: input.headers ?? {},
        delayMs: input.delayMs ?? 0,
        isActive: input.isActive ?? true,
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

  public async findByMethodAndPath(method: HttpMethod, path: string) {
    const rows = await this.sqliteClient.db
      .select()
      .from(mockDefinitionsTable)
      .where(and(eq(mockDefinitionsTable.method, method), eq(mockDefinitionsTable.path, path)))
      .limit(1);

    const row = rows[0];
    return row === undefined ? null : this.toDomain(row);
  }

  public async list() {
    const rows = await this.sqliteClient.db.select().from(mockDefinitionsTable);
    return rows.map((row) => this.toDomain(row));
  }

  private toDomain(row: MockDefinitionRow) {
    const props: MockDefinitionProps = {
      id: row.id,
      name: row.name,
      method: row.method as HttpMethod,
      path: row.path,
      statusCode: row.statusCode,
      responseBody: row.responseBody,
      headers: row.headers,
      delayMs: row.delayMs,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };

    return new MockDefinition(props);
  }
}
