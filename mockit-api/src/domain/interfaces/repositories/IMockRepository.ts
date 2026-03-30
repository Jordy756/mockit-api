import type { Mock } from "../../entities/Mock.js";

export interface IMockRepository {
  insert(mockRecordId: string, mock: Mock): Promise<Mock>;
  update(mockId: string, mock: Mock): Promise<Mock>;
  patch(mockId: string, mock: Mock): Promise<Mock>;
  delete(mockId: string): Promise<boolean>;
  getAll(mockRecordId: string): Promise<Mock[]>;
}
