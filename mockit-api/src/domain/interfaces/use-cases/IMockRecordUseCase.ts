import { MockRecord } from "../../entities/MockRecord.js";

export interface IMockRecordUseCase {
  insert(data: { mockDTOs: Record<string, unknown>[] }): Promise<MockRecord>;
  getAll(): Promise<MockRecord[]>;
}
