import type { JsonObject, JsonValue } from "../../domain/entities/Template.js";
import type { ITemplateRepository } from "../../domain/interfaces/repositories/ITemplateRepository.js";
import type {
  IMockStateRepository,
  MockStateRecord,
} from "../../domain/interfaces/repositories/IMockStateRepository.js";
import type { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockUseCase implements IMockUseCase {
  constructor(
    private readonly mockRepository: ITemplateRepository,
    private readonly mockStateRepository: IMockStateRepository,
  ) {}

  public async insert(mockId: string, payload: JsonValue): Promise<MockStateRecord> {
    // return this.mockStateRepository.insert(newState);
    return await this.mockStateRepository.upsertBySimulationId(mockId, payload);
  }

  public async getAll(mockId: string): Promise<MockStateRecord> {
    return await this.mockStateRepository.getBySimulationId(mockId).then((record) => {
      if (!record) {
        throw new Error(`Mock state with id ${mockId} not found`);
      }
      return this.toDetachedRecord(record);
    });
  }

  private isJsonObject(value: JsonValue): value is JsonObject {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private cloneJson(value: JsonValue): JsonValue {
    return JSON.parse(JSON.stringify(value)) as JsonValue;
  }

  private toDetachedRecord(record: MockStateRecord): MockStateRecord {
    return {
      mockId: record.mockId,
      state: this.cloneJson(record.state),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
