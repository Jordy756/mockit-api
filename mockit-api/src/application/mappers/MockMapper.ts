import { Mock } from "../../domain/entities/Mock.js";
import { MockDTO } from "../dtos/MockDTO.js";

export class MockMapper {
  public static toMock({ id, data, createdAt, updatedAt }: MockDTO): Mock {
    return new Mock({ id, data, createdAt, updatedAt });
  }

  public static toMockDTO({ id, data, createdAt, updatedAt }: Mock): MockDTO {
    return new MockDTO({ id, data, createdAt, updatedAt });
  }

  public static toMockDTOs(mocks: Mock[]): MockDTO[] {
    return mocks.map((mock) => this.toMockDTO(mock));
  }
}
