import { randomUUID } from "node:crypto";
import { Mock } from "../../domain/entities/Mock.js";
import { MockRecord } from "../../domain/entities/MockRecord.js";
import type { IMockRecordRepository } from "../../domain/interfaces/repositories/IMockRecordRepository.js";
import type { IMockRecordUseCase } from "../../domain/interfaces/use-cases/IMockRecordUseCase.js";

export class MockRecordUseCase implements IMockRecordUseCase {
  constructor(private readonly mockRecordRepository: IMockRecordRepository) {}

  public async insert(mockRecord: MockRecord): Promise<MockRecord> {
    const now = new Date();
    const mockEntry = mockRecord.mocks[0].data;
    const mocksEntities = Array.from(
      { length: 4 },
      () => new Mock({ id: randomUUID(), data: mockEntry }),
    );

    mockRecord.id = randomUUID();
    mockRecord.createdAt = now;
    mockRecord.updatedAt = now;
    mockRecord.mocks = mocksEntities;

    return this.mockRecordRepository.insert(mockRecord);
  }

  public async getAll(): Promise<MockRecord[]> {
    return await this.mockRecordRepository.getAll();
  }
}
