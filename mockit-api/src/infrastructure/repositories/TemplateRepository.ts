import { Template } from "../../domain/entities/Template.js";
import type { JsonValue } from "../../domain/entities/Template.js";
import type { ITemplateRepository } from "../../domain/interfaces/repositories/ITemplateRepository.js";
import { mockDefinitionsTable, type TemplateDefinitionRow } from "./sqlite/schema/template.schema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";
import { eq } from "drizzle-orm";

export class TemplateRepository implements ITemplateRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async insert({ id, payload, createdAt, updatedAt }: Template) {
    const rows = await this.sqliteClient.db
      .insert(mockDefinitionsTable)
      .values({
        id,
        payload,
        createdAt,
        updatedAt,
      })
      .returning();

    const row = rows[0];

    if (row === undefined) throw new Error("Failed to persist mock definition");

    return this.toDomain(row);
  }

  public async getAll() {
    const rows = await this.sqliteClient.db.select().from(mockDefinitionsTable);
    return rows.map((row) => this.toDomain(row));
  }

  public async getById(templateId: string) {
    const rows = await this.sqliteClient.db
      .select()
      .from(mockDefinitionsTable)
      .where(eq(mockDefinitionsTable.id, templateId))
      .limit(1);

    const row = rows[0];
    return row === undefined ? null : this.toDomain(row);
  }

  public async updateById(templateId: string, payload: JsonValue) {
    const now = new Date();

    const rows = await this.sqliteClient.db
      .update(mockDefinitionsTable)
      .set({
        payload,
        updatedAt: now,
      })
      .where(eq(mockDefinitionsTable.id, templateId))
      .returning();

    const row = rows[0];
    return row === undefined ? null : this.toDomain(row);
  }

  public async deleteById(templateId: string) {
    const rows = await this.sqliteClient.db
      .delete(mockDefinitionsTable)
      .where(eq(mockDefinitionsTable.id, templateId))
      .returning({ id: mockDefinitionsTable.id });

    return rows[0] !== undefined;
  }

  private toDomain(row: TemplateDefinitionRow) {
    const mock = new Template(row.payload);
    return Object.assign(mock, {
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }) as Template;
  }
}
