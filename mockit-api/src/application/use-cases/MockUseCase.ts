import { Mock } from "../../domain/entities/Mock.js";
import type { NewMockDefinitionProps } from "../../domain/entities/Mock.js";
import type { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import type { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockUseCase implements IMockUseCase {
  constructor(private readonly mockRepository: IMockRepository) {}

  public async register(input: NewMockDefinitionProps) {
    const newMock = Mock.createNew(input);
    return this.mockRepository.register(newMock);
  }
}
