import { MockRecord } from "../../entities/MockRecord.js";

export interface IMockRecordRepository {
  insert(mockRecord: MockRecord): Promise<MockRecord>;
  getAll(): Promise<MockRecord[]>;
}
