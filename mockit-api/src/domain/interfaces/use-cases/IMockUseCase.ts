import type { Mock } from "../../entities/Mock.js";

export interface IMockUseCase {
  insert(recordId: string, data: { data: Record<string, unknown> }): Promise<Mock>;
  getAll(recordId: string): Promise<Mock[]>;
}
