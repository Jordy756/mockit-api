import { randomUUID } from "node:crypto";
import { injectable, inject } from "inversify";
import { Mock } from "../../domain/entities/Mock.js";
import { MockRecord } from "../../domain/entities/MockRecord.js";
import { IAiDataGeneratorHelper } from "../../domain/interfaces/helpers/IAiDataGeneratorHelper.js";
import type { IMockRecordRepository } from "../../domain/interfaces/repositories/IMockRecordRepository.js";
import type { IMockRecordUseCase } from "../../domain/interfaces/use-cases/IMockRecordUseCase.js";
import { TYPES } from "../../infrastructure/di/types.js";

@injectable()
export class MockRecordUseCase implements IMockRecordUseCase {
  constructor(@inject(TYPES.IMockRecordRepository)
    private readonly mockRecordRepository: IMockRecordRepository,
    private readonly aiDataGeneratorHelper: IAiDataGeneratorHelper,
  ) {}

  public async insert(mockRecord: MockRecord): Promise<MockRecord> {
    const now = new Date();
    const mockEntry = mockRecord.mocks[0];
    const generatedData = await this.aiDataGeneratorHelper.generateData(mockEntry);
    
    mockRecord.id = randomUUID();
    mockRecord.createdAt = now;
    mockRecord.updatedAt = now;
    mockRecord.mocks = generatedData;

    return this.mockRecordRepository.insert(mockRecord);
  }

  public async getAll(): Promise<MockRecord[]> {
    return await this.mockRecordRepository.getAll();
  }
}
