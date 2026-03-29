import { randomUUID } from "node:crypto";
import { Mock } from "../../domain/entities/Mock.js";
import { MockRecord } from "../../domain/entities/MockRecord.js";
import type { IMockRecordRepository } from "../../domain/interfaces/repositories/IMockRecordRepository.js";
import type { IMockRecordUseCase } from "../../domain/interfaces/use-cases/IMockRecordUseCase.js";

export class MockRecordUseCase implements IMockRecordUseCase {
  constructor(private readonly mockRecordRepository: IMockRecordRepository) {}

  public async insert(mockRecord: MockRecord): Promise<MockRecord> {
    if (mockRecord.mocks.length > 50) {
      throw new Error("Cannot insert more than 50 records in a single request.");
    }

    const mocksWithIds = mockRecord.mocks.map((mock) => new Mock({ id: randomUUID(), data: mock.data }));

    const recordToInsert = new MockRecord({
      id: mockRecord.id,
      mocks: mocksWithIds,
      createdAt: mockRecord.createdAt,
      updatedAt: mockRecord.updatedAt,
    });

    return this.mockRecordRepository.insert(recordToInsert);
  }

  public async getAll(): Promise<MockRecord[]> {
    return await this.mockRecordRepository.getAll();
  }
}
