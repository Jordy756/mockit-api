import { eq } from "drizzle-orm";

import { Mock } from "../../domain/entities/Mock.js";
import type { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { mocksTable, type MockRow } from "./sqlite/schema/mock.schema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockRepository implements IMockRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async insert({ id, templateId, data, createdAt, updatedAt }: Mock): Promise<Mock> {
    const rows = await this.sqliteClient.db
      .insert(mocksTable)
      .values({
        id,
        templateId,
        data,
        createdAt,
        updatedAt,
      })
      .returning();

    const row = rows[0];

    if (row === undefined) {
      throw new Error("Failed to persist mock row");
    }

    return this.toDomain(row);
  }

  public async getAllByTemplateId(templateId: string): Promise<Mock[]> {
    const rows = await this.sqliteClient.db.select().from(mocksTable).where(eq(mocksTable.templateId, templateId));

    return rows.map((row) => this.toDomain(row));
  }

  private toDomain(row: MockRow): Mock {
    const mock = new Mock(row.templateId, row.data);
    return Object.assign(mock, {
      id: row.id,
      templateId: row.templateId,
      data: row.data,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
