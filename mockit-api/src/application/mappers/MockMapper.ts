import { Mock } from "../../domain/entities/Mock.js";
import { MockDTO } from "../dtos/MockDTO.js";

export class MockMapper {
  public static toMock({ data }: MockDTO): Mock {
    return new Mock(data);
  }

  public static toMockDTO({ data }: Mock): MockDTO {
    return new MockDTO(data);
  }

  public static toMockDTOs(mocks: Mock[]): MockDTO[] {
    return mocks.map((mock) => this.toMockDTO(mock));
  }
}
