import { Mock } from "../../domain/entities/Mock.js";
import { MockDTO } from "../dtos/MockDTO.js";
import { randomUUID } from "node:crypto";

export class MockMapper {
  public static toMock({ id, data }: MockDTO): Mock {
    return new Mock({ id: id ?? randomUUID(), data });
  }

  public static toMockDTO({ id, data }: Mock): MockDTO {
    return new MockDTO({ id, data });
  }

  public static toMockDTOs(mocks: Mock[]): MockDTO[] {
    return mocks.map((mock) => this.toMockDTO(mock));
  }
}
