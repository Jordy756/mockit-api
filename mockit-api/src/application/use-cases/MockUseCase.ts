import { randomUUID } from "node:crypto";
import { Mock } from "../../domain/entities/Mock.js";
import { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockUseCase implements IMockUseCase {
  constructor(private readonly mockRepository: IMockRepository) {}

  public async insert(mockRecordId: string, mock: Mock): Promise<Mock> {
    mock.id = randomUUID();
    console.log(mock.id);
    return this.mockRepository.insert(mockRecordId, mock);
  }

  public async update(mockId: string, mock: Mock): Promise<Mock> {
    return this.mockRepository.update(mockId, mock);
  }

  public async patch(mockId: string, mock: Mock): Promise<Mock> {
    return this.mockRepository.patch(mockId, mock);
  }

  public async delete(mockId: string): Promise<boolean> {
    return this.mockRepository.delete(mockId);
  }

  public async getAll(mockRecordId: string): Promise<Mock[]> {
    return await this.mockRepository.getAll(mockRecordId);
  }
}
