import { MockRecord } from "../../domain/entities/MockRecord.js";
import { GetMockRecordDTO } from "../dtos/MockRecordDTO.js";
import { MockMapper } from "./MockMapper.js";

export class MockRecordMapper {
  public static toMockRecord({ id, mocks, createdAt, updatedAt }: MockRecord): MockRecord {
    return new MockRecord({
      id,
      mocks: mocks.map((m) => MockMapper.toMockDTO(m)),
      createdAt,
      updatedAt,
    });
  }

  public static toMockRecordDTO({ id, mocks, createdAt, updatedAt }: MockRecord): GetMockRecordDTO {
    return new GetMockRecordDTO({
      id,
      mocks: mocks.map(MockMapper.toMockDTO),
      createdAt,
      updatedAt,
    });
  }

  public static toMockRecordDTOs(mocks: MockRecord[]): GetMockRecordDTO[] {
    return mocks.map((mock) => this.toMockRecordDTO(mock));
  }
}
