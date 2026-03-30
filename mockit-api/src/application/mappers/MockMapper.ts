// MockMapper.ts
import { Mock } from "../../domain/entities/Mock.js";
import { CreateMockInput, MockResponse } from "../dtos/MockDTO.js";

export class MockMapper {
  public static toEntity(input: CreateMockInput): Mock {
    return new Mock({ id: "", data: input });
  }

  public static toResponse(mock: Mock): MockResponse {
    return { id: mock.id, ...mock.data };
  }

  public static toResponses(mocks: Mock[]): MockResponse[] {
    return mocks.map(this.toResponse);
  }
}
