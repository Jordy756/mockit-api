import { MockRecord } from "../../domain/entities/MockRecord.js";
import type { IMockRecordRepository } from "../../domain/interfaces/repositories/IMockRecordRepository.js";
import type { IMockRecordUseCase } from "../../domain/interfaces/use-cases/IMockRecordUseCase.js";

export class MockRecordUseCase implements IMockRecordUseCase {
  constructor(private readonly mockRecordRepository: IMockRecordRepository) {}

  public async insert(mockRecord: MockRecord): Promise<MockRecord> {
    mockRecord.mock.data.push(mockRecord.mock.data[0]);

    console.log(mockRecord.mock.data);
    return this.mockRecordRepository.insert(mockRecord);
  }

  public async getAll(): Promise<MockRecord[]> {
    return await this.mockRecordRepository.getAll();
  }
}
