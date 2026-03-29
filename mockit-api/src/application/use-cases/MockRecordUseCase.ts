import { randomUUID } from "node:crypto";
import { Mock } from "../../domain/entities/Mock.js";
import { MockRecord } from "../../domain/entities/MockRecord.js";
import type { IMockRecordRepository } from "../../domain/interfaces/repositories/IMockRecordRepository.js";
import type { IMockRecordUseCase } from "../../domain/interfaces/use-cases/IMockRecordUseCase.js";

export class MockRecordUseCase implements IMockRecordUseCase {
  constructor(private readonly mockRecordRepository: IMockRecordRepository) {}

  public async insert(data: { mockDTOs: Record<string, unknown>[] }): Promise<MockRecord> {
    if (data.mockDTOs.length > 50) {
      throw new Error("Cannot insert more than 50 records in a single request.");
    }

    const recordId = randomUUID();
    const now = new Date();

    const mocksEntities = data.mockDTOs.map((mockData) => new Mock({ id: randomUUID(), data: mockData }));

    const recordToInsert = new MockRecord({
      id: recordId,
      mocks: mocksEntities,
      createdAt: now,
      updatedAt: now,
    });

    return this.mockRecordRepository.insert(recordToInsert);
  }

  public async getAll(): Promise<MockRecord[]> {
    return await this.mockRecordRepository.getAll();
  }
}
