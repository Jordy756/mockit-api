import { Mock } from "../../domain/entities/Mock.js";
import { MockRecord } from "../../domain/entities/MockRecord.js";
import {
  CreateMockRecordDTO,
  GetMockRecordDTO,
} from "../dtos/MockRecordDTO.js";
import { MockMapper } from "./MockMapper.js";

export class MockRecordMapper {
  public static toMockRecord({ mockDTO }: CreateMockRecordDTO): MockRecord {
    return new MockRecord({
      id: "",
      mocks: [new Mock({ id: "", data: mockDTO })],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static toMockRecordDTO({
    id,
    mocks,
    createdAt,
    updatedAt,
  }: MockRecord): GetMockRecordDTO {
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
