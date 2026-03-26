import { MockDefinition } from "../../domain/entities/Mock.js";
import type { NewMockDefinitionProps } from "../../domain/entities/Mock.js";
import type { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import type { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class RegisterMockUseCase implements IMockUseCase {
  constructor(private readonly mockRepository: IMockRepository) {}

  public async execute(input: NewMockDefinitionProps) {
    const newMock = MockDefinition.createNew(input);

    const existing = await this.mockRepository.findByMethodAndPath(newMock.method, newMock.path);

    if (existing !== null) {
      throw new Error("A mock already exists for this method and path");
    }

    return this.mockRepository.create(newMock);
  }
}
