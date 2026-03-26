import type { Mock, NewMockDefinitionProps } from "../../entities/Mock.js";

export interface IMockUseCase {
  register(input: NewMockDefinitionProps): Promise<Mock>;
}
