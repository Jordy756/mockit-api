import { Mock } from "../../domain/entities/Mock.js";
import type { JsonValue } from "../../domain/entities/Mock.js";
import type { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import type { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockUseCase implements IMockUseCase {
  constructor(private readonly mockRepository: IMockRepository) {}

  public async register(payload: JsonValue): Promise<Mock> {
    const newMock = new Mock(payload);
    
    return this.mockRepository.register(newMock);
  }

  public async list(): Promise<Mock[]> {
    return this.mockRepository.list();
  }
}
