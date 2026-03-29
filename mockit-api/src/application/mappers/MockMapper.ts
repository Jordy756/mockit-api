import { Mock } from "../../domain/entities/Mock.js";
import { MockDTO } from "../dtos/MockDTO.js";

export class MockMapper {
  public static toMockDTO({ id, data }: Mock): MockDTO {
    return new MockDTO({ id, data });
  }

  public static toMockDTOs(mocks: Mock[]): MockDTO[] {
    return mocks.map((mock) => this.toMockDTO(mock));
  }
}
