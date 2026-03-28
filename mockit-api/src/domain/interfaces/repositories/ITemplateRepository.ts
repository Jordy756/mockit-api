import type { Mock } from "../../entities/Mock.js";

export interface ITemplateRepository {
  insert(mock: Mock): Promise<Mock>;
  getAll(): Promise<Mock[]>;
}
