// MockMapper.ts
import { List } from "../../domain/entities/List.js";
import { Mock } from "../../domain/entities/Mock.js";
import { CreateMockInput, MockResponse } from "../dtos/MockDTO.js";
import { ListMockDTO } from "../dtos/ListMockDTO.js";

export class MockMapper {
  public static toEntity(input: CreateMockInput): Mock {
    const { id: _disposedId, ...cleanData } = input as Record<string, unknown>;
    return new Mock({ id: "", data: cleanData });
  }

  public static toResponse(mock: Mock): MockResponse {
    return { id: mock.id, ...mock.data };
  }

  public static toResponses(mocks: Mock[]): MockResponse[] {
    return mocks.map(this.toResponse);
  }

  public static toListResponse(list: List<Mock>): ListMockDTO {
    return {
      items: list.items.map((mock) => this.toResponse(mock)),
      currentPage: list.currentPage,
      totalPages: list.totalPages,
    };
  }
}
