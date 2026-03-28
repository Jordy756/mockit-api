import { Mock } from "../../domain/entities/Mock.js";
import { eq } from "drizzle-orm";
import { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { mockTable, type MockRow } from "./sqlite/schema/mock.schema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockRepository implements IMockRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async insert(mockId: string, { data, createdAt, updatedAt }: Mock): Promise<Mock> {
    // 1. Primero buscar el mock con el id
    const existingRows = await this.sqliteClient.db
      .select({ id: mockTable.id })
      .from(mockTable)
      .where(eq(mockTable.id, mockId))
      .limit(1);

    // 2. Insertar el mock dentro del mockTable.data
    const rows = await this.sqliteClient.db
      .insert(mockTable)
      .values({
        id: mockId,
        data,
        createdAt,
        updatedAt,
      })
      .onConflictDoUpdate({
        target: mockTable.id,
        set: {
          data,
          updatedAt,
        },
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
    return new Mock({
      id,
      data,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
    });
  }
}
