import type { MockDefinition, NewMockDefinitionProps } from "../../domain/entities/Mock.js";
import type { RegisterMockInput, RegisterMockResponse } from "../dtos/MockDTO.js";

export class MockMapper {
  public static toNewDomain(input: RegisterMockInput): NewMockDefinitionProps {
    return {
      name: input.name,
      method: input.method,
      path: input.path,
      statusCode: input.statusCode,
      responseBody: input.responseBody,
      headers: input.headers,
      delayMs: input.delayMs,
      isActive: input.isActive,
    };
  }

  public static toResponse(mock: MockDefinition): RegisterMockResponse {
    return {
      id: mock.id,
      name: mock.name,
      method: mock.method,
      path: mock.path,
      statusCode: mock.statusCode,
      responseBody: mock.responseBody,
      headers: mock.headers,
      delayMs: mock.delayMs,
      isActive: mock.isActive,
      createdAt: mock.createdAt.toISOString(),
      updatedAt: mock.updatedAt.toISOString(),
    };
  }
}
