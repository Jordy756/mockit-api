import { Mock } from "../../domain/entities/Mock.js";
import { CreateMockDTO, GetMockDTO } from "../dtos/MockDTO.js";

export class MockMapper {
  public static toMock({ data }: CreateMockDTO): Mock {
    return new Mock({ id: "", data });
  }

  public static toMockDTO(mock: Mock): GetMockDTO {
    return new GetMockDTO(mock);
  }

  public static toMockDTOs(mocks: Mock[]): GetMockDTO[] {
    return mocks.map((mock) => this.toMockDTO(mock));
  }
}
