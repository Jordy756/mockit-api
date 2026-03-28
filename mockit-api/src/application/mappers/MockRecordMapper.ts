import { MockRecord } from "../../domain/entities/MockRecord.js";
import { MockRecordDTO } from "../dtos/MockRecordDTO.js";
import { MockMapper } from "./MockMapper.js";

export class MockRecordMapper {
  public static toMockRecord({ id, mockDTO, createdAt, updatedAt }: MockRecordDTO): MockRecord {
    return new MockRecord({ id, mock: mockDTO, createdAt, updatedAt });
  }

  public static toMockRecordDTO({ id, mock, createdAt, updatedAt }: MockRecord): MockRecordDTO {
    return new MockRecordDTO({
      id,
      mockDTO: MockMapper.toMockDTO(mock),
      createdAt,
      updatedAt,
    });
  }

  public static toMockRecordDTOs(mocks: MockRecord[]): MockRecordDTO[] {
    return mocks.map((mock) => this.toMockRecordDTO(mock));
  }
}
