import type { JsonValue } from "../../entities/Template.js";
import type { MockStateRecord } from "../repositories/IMockStateRepository.js";

export interface IMockUseCase {
  insert(mockId: string, payload: JsonValue): Promise<MockStateRecord>;
  getAll(mockId: string): Promise<MockStateRecord>;
}
