import type { HttpMethod, MockDefinition, NewMockDefinitionProps } from "../../entities/Mock.js";

export interface IMockRepository {
  create(input: NewMockDefinitionProps): Promise<MockDefinition>;
  findByMethodAndPath(method: HttpMethod, path: string): Promise<MockDefinition | null>;
  list(): Promise<MockDefinition[]>;
}
