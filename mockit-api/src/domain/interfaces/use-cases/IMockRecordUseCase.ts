import { MockRecord } from "../../entities/MockRecord.js";

export interface IMockRecordUseCase {
  insert(mockRecord: MockRecord): Promise<MockRecord>;
  getAll(): Promise<MockRecord[]>;
}
