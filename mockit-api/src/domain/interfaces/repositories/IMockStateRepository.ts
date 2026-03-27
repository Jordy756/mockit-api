import type { JsonValue } from "../../entities/Template.js";

export interface MockStateRecord {
  mockId: string;
  state: JsonValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMockStateRepository {
  getBySimulationId(mockId: string): Promise<MockStateRecord | null>;
  upsertBySimulationId(mockId: string, state: JsonValue): Promise<MockStateRecord>;
  deleteBySimulationId(mockId: string): Promise<boolean>;
}
