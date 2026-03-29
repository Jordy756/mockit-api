import { MockRecord } from "../../domain/entities/MockRecord.js";
import { MockRecordDTO } from "../dtos/MockRecordDTO.js";
import { MockMapper } from "./MockMapper.js";

export class MockRecordMapper {
  public static toMockRecordDTO({ id, mocks, createdAt, updatedAt }: MockRecord): MockRecordDTO {
    return new MockRecordDTO({
      id,
      mocks: mocks.map(MockMapper.toMockDTO),
      createdAt,
      updatedAt,
    });
  }

  public static toMockRecordDTOs(mocks: MockRecord[]): MockRecordDTO[] {
    return mocks.map((mock) => this.toMockRecordDTO(mock));
  }
}
