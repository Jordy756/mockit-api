import type { Mock, NewMockDefinitionProps } from "../../domain/entities/Mock.js";
import type { RegisterMockInput, RegisterMockResponse } from "../dtos/MockDTO.js";

export class MockMapper {
  public static toMock(input: RegisterMockInput): NewMockDefinitionProps {
    return {
      payload: input,
    };
  }

  public static toMockDTO({ id, payload, createdAt, updatedAt }: Mock): RegisterMockResponse {
    return {
      id,
      payload,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  }
}
