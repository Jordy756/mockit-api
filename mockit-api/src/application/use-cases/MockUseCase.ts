import { Mock } from "../../domain/entities/Mock.js";
import { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockUseCase implements IMockUseCase {
  constructor(private readonly mockRepository: IMockRepository) {}

  public async insert(mockId: string, mock: Mock): Promise<Mock> {
    return this.mockRepository.insert(mockId, mock);
  }

  public async getAll(mockId: string): Promise<Mock[]> {
    return await this.mockRepository.getAll(mockId);
  }
}
