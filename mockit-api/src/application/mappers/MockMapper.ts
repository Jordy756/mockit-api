import { Mock } from "../../domain/entities/Mock.js";

export class MockMapper {
  public static toEntity(data: any): Mock {
    return new Mock(data);
  }

  public static toDTO({ id, data, createdAt, updatedAt }: Mock): any {
    return {
      id,
      data,
      createdAt,
      updatedAt,
    };
  }

  public static toDTOs(mocks: Mock[]): any[] {
    return mocks.map((mock) => this.toDTO(mock));
  }
}
