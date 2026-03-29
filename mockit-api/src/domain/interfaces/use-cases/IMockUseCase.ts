import type { Mock } from "../../entities/Mock.js";

export interface IMockUseCase {
  insert(mockId: string, mock: Mock): Promise<Mock>;
  getAll(mockId: string): Promise<Mock[]>;
}
