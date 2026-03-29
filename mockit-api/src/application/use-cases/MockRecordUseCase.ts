import { MockRecord } from "../../domain/entities/MockRecord.js";
import { IAiDataGeneratorHelper } from "../../domain/interfaces/helpers/IAiDataGeneratorHelper.js";
import type { IMockRecordRepository } from "../../domain/interfaces/repositories/IMockRecordRepository.js";
import type { IMockRecordUseCase } from "../../domain/interfaces/use-cases/IMockRecordUseCase.js";

export class MockRecordUseCase implements IMockRecordUseCase {
  constructor(
    private readonly mockRecordRepository: IMockRecordRepository,
    private readonly aiDataGeneratorHelper: IAiDataGeneratorHelper) {}

  public async insert(mockRecord: MockRecord): Promise<MockRecord> {

    console.log(mockRecord.mock);

    var generatedData = await this.aiDataGeneratorHelper.generateData(mockRecord.mock);
    
    generatedData.data.forEach(item => {
      mockRecord.mock.data.push(item);  
    });
    
    console.log(mockRecord.mock.data);
    return this.mockRecordRepository.insert(mockRecord);
  }

  public async getAll(): Promise<MockRecord[]> {
    return await this.mockRecordRepository.getAll();
  }
}
