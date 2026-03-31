import type { List } from "../../entities/List.js";
import type { Mock } from "../../entities/Mock.js";
import type { RequestOption } from "../../entities/RequestOption.js";

export interface IMockRepository {
  insert(mockRecordId: string, mock: Mock): Promise<Mock>;
  update(mockRecordId: string, mockId: string, mock: Mock): Promise<Mock>;
  patch(mockRecordId: string, mockId: string, mock: Mock): Promise<Mock>;
  delete(mockRecordId: string, mockId: string): Promise<boolean>;
  getById(mockRecordId: string, mockId: string): Promise<Mock | null>;
  getAll(mockRecordId: string, requestOption?: RequestOption): Promise<List<Mock>>;
}
