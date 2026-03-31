import { randomUUID } from "node:crypto";
import { injectable, inject } from "inversify";
import { Mock } from "../../domain/entities/Mock.js";
import { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";
import { TYPES } from "../../infrastructure/di/types.js";

@injectable()
export class MockUseCase implements IMockUseCase {
  constructor(@inject(TYPES.IMockRepository) private readonly mockRepository: IMockRepository) {}

  public async insert(mockRecordId: string, mock: Mock): Promise<Mock> {
    mock.id = randomUUID();
    return await this.mockRepository.insert(mockRecordId, mock);
  }

  public async update(mockRecordId: string, mockId: string, mock: Mock): Promise<Mock> {
    mock.id = mockId;
    return this.mockRepository.update(mockRecordId, mockId, mock);
  }

  public async patch(mockRecordId: string, mockId: string, mock: Mock): Promise<Mock> {
    mock.id = mockId;
    return this.mockRepository.patch(mockRecordId, mockId, mock);
  }

  public async delete(mockRecordId: string, mockId: string): Promise<boolean> {
    return this.mockRepository.delete(mockRecordId, mockId);
  }

  public async getById(mockRecordId: string, mockId: string): Promise<Mock | null> {
    return await this.mockRepository.getById(mockRecordId, mockId);
  }

  public async getAll(mockRecordId: string): Promise<Mock[]> {
    return await this.mockRepository.getAll(mockRecordId);
  }
}
