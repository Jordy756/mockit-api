import type { MockDefinition, NewMockDefinitionProps } from "../../entities/mock.entity.js";

export interface IRegisterMockUseCase {
  execute(input: NewMockDefinitionProps): Promise<MockDefinition>;
}
