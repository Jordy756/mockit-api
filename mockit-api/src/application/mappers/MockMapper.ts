import { Mock } from "../../domain/entities/Mock.js";
import { GetMockDTO } from "../dtos/MockDTO.js";

export class MockMapper {
  public static toMockDTO({ id, data }: Mock): GetMockDTO {
    return new GetMockDTO({ id, data });
  }

  public static toMockDTOs(mocks: Mock[]): GetMockDTO[] {
    return mocks.map((mock) => this.toMockDTO(mock));
  }
}
