import type { Mock, NewMockDefinitionProps } from "../../entities/Mock.js";

export interface IMockRepository {
  register(input: NewMockDefinitionProps): Promise<Mock>;
  list(): Promise<Mock[]>;
}
