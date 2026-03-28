import type { Mock } from "../../entities/Mock.js";

export interface ITemplateUseCase {
  insert(mock: Mock): Promise<Mock>;
  getAll(): Promise<Mock[]>;
}
