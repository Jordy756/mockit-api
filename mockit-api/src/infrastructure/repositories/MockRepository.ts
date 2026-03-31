import { injectable, inject } from "inversify";
import { eq, and, sql } from "drizzle-orm";
import { List } from "../../domain/entities/List.js";
import { Mock } from "../../domain/entities/Mock.js";
import { RequestOption } from "../../domain/entities/RequestOption.js";
import { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { PaginationService } from "../services/PaginationService.js";
import { mockTable } from "./sqlite/schema/mockSchema.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";
import { TYPES } from "../di/types.js";

@injectable()
export class MockRepository implements IMockRepository {
  constructor(@inject(TYPES.SqliteClient) private readonly sqliteClient: SqliteClient) {}

  public async insert(mockRecordId: string, mock: Mock): Promise<Mock> {
    const { id, data } = mock;

    await this.sqliteClient.db.insert(mockTable).values({
      id: id,
      recordId: mockRecordId,
      data: data,
    });

    return mock;
  }

  public async update(mockRecordId: string, mockId: string, mock: Mock): Promise<Mock> {
    const rows = await this.sqliteClient.db
      .update(mockTable)
      .set({ data: mock.data })
      .where(and(eq(mockTable.id, mockId), eq(mockTable.recordId, mockRecordId)))
      .returning({ id: mockTable.id, data: mockTable.data });

    if (rows.length === 0) throw new Error("Mock not found");

    return mock;
  }

  public async patch(mockRecordId: string, mockId: string, mock: Mock): Promise<Mock> {
    const existing = await this.sqliteClient.db
      .select({ data: mockTable.data })
      .from(mockTable)
      .where(and(eq(mockTable.id, mockId), eq(mockTable.recordId, mockRecordId)))
      .limit(1);

    if (existing.length === 0) throw new Error("Mock not found");

    const mergedData = {
      ...(existing[0].data as Record<string, unknown>),
      ...mock.data,
    };

    await this.sqliteClient.db
      .update(mockTable)
      .set({ data: mergedData })
      .where(and(eq(mockTable.id, mockId), eq(mockTable.recordId, mockRecordId)))
      .returning({ id: mockTable.id, data: mockTable.data });

    return mock;
  }

  public async delete(mockRecordId: string, mockId: string): Promise<boolean> {
    const rows = await this.sqliteClient.db
      .delete(mockTable)
      .where(and(eq(mockTable.id, mockId), eq(mockTable.recordId, mockRecordId)))
      .returning({ id: mockTable.id });

    return rows.length > 0;
  }

  public async getById(mockRecordId: string, mockId: string): Promise<Mock | null> {
    const rows = await this.sqliteClient.db
      .select({ id: mockTable.id, data: mockTable.data })
      .from(mockTable)
      .where(and(eq(mockTable.id, mockId), eq(mockTable.recordId, mockRecordId)))
      .limit(1);

    if (rows.length === 0) return null;

    return new Mock(rows[0]);
  }

  public async getAll(mockRecordId: string, requestOption?: RequestOption): Promise<List<Mock>> {
    // Default request option if not provided
    const page = requestOption?.page ?? 1;
    const limit = requestOption?.limit ?? 10;
    const field = requestOption?.field;
    const fieldValue = requestOption?.fieldValue;

    // Build base condition
    let baseCondition = eq(mockTable.recordId, mockRecordId);

    // Add field-value filtering if provided
    if (field && fieldValue) {
      // Use json_extract + LIKE for SQLite JSON filtering with substring search
      baseCondition = and(
        baseCondition,
        sql`json_extract(${mockTable.data}, ${"$." + field}) LIKE ${`%${fieldValue}%`}`,
      ) as any;
    }

    // Count total items matching the filter (for pagination metadata)
    const countQuery = await this.sqliteClient.db
      .select({ count: sql<number>`COUNT(*) as count` })
      .from(mockTable)
      .where(baseCondition);

    const totalItems = countQuery[0]?.count ?? 0;

    // Calculate pagination
    const pagination = PaginationService.calculatePagination(page, limit, totalItems);

    // Fetch paginated results
    const rows = await this.sqliteClient.db
      .select({ id: mockTable.id, data: mockTable.data })
      .from(mockTable)
      .where(baseCondition)
      .offset(pagination.skip)
      .limit(pagination.limit);

    const items = rows.length === 0 ? [] : rows.map(({ id, data }) => new Mock({ id, data }));

    return new List<Mock>({
      items,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
    });
  }
}
