import type { Mock } from "../../entities/Mock.js";

export interface IMockRepository {
  insert(recordId: string, mock: Mock): Promise<Mock>;
  getAll(recordId: string): Promise<Mock[]>;
  update(mockId: string, data: Record<string, unknown>): Promise<Mock>;
  patch(mockId: string, data: Record<string, unknown>): Promise<Mock>;
  delete(mockId: string): Promise<boolean>;
}
