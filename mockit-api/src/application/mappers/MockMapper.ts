import type { Mock } from "../../domain/entities/Mock.js";
import type { RegisterMockInput, RegisterMockResponse } from "../dtos/MockDTO.js";

export class MockMapper {
  public static toPayload(input: RegisterMockInput) {
    return input;
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
