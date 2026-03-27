import type { Mock } from "../../entities/Mock.js";

export interface IMockUseCase {
  insert(mock: Mock): Promise<Mock>;
  getAll(): Promise<Mock[]>;
}
