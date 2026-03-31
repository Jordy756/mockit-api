// MockRecordMapper.ts
import { Mock } from "../../domain/entities/Mock.js";
import { MockRecord } from "../../domain/entities/MockRecord.js";
import { CreateMockRecordInput, MockRecordResponse } from "../dtos/MockRecordDTO.js";
import { MockMapper } from "./MockMapper.js";

export class MockRecordMapper {
  public static toEntity(input: CreateMockRecordInput): MockRecord {
    return new MockRecord({
      id: "",
      mocks: [new Mock({ id: "", data: input })],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static toResponse(record: MockRecord): MockRecordResponse {
    return {
      id: record.id,
      mocks: MockMapper.toResponses(record.mocks),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  public static toResponses(records: MockRecord[]): MockRecordResponse[] {
    return records.map(this.toResponse);
  }
}
