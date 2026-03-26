import type { MockDefinition, NewMockDefinitionProps } from "../../entities/Mock.js";

export interface IMockUseCase {
  execute(input: NewMockDefinitionProps): Promise<MockDefinition>;
}
