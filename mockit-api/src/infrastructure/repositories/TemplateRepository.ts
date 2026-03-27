import { Template } from "../../domain/entities/Template.js";
import type { ITemplateRepository } from "../../domain/interfaces/repositories/ITemplateRepository.js";
import { templateDefinitionsTable, type TemplateDefinitionRow } from "./sqlite/schema/template.schema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";
import { eq } from "drizzle-orm";

export class TemplateRepository implements ITemplateRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async insert({ id, createdAt, updatedAt }: Template): Promise<Template> {
    const rows = await this.sqliteClient.db
      .insert(templateDefinitionsTable)
      .values({
        id,
        createdAt,
        updatedAt,
      })
      .returning();

    const row = rows[0];

    if (row === undefined) throw new Error("Failed to persist template");

    return this.toDomain(row);
  }

  public async getAll(): Promise<Template[]> {
    const rows = await this.sqliteClient.db.select().from(templateDefinitionsTable);
    return rows.map((row) => this.toDomain(row));
  }

  public async getById(templateId: string): Promise<Template | null> {
    const rows = await this.sqliteClient.db
      .select()
      .from(templateDefinitionsTable)
      .where(eq(templateDefinitionsTable.id, templateId))
      .limit(1);

    const row = rows[0];
    return row === undefined ? null : this.toDomain(row);
  }

  private toDomain(row: TemplateDefinitionRow) {
    const template = new Template();
    return Object.assign(template, {
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }) as Template;
  }
}
