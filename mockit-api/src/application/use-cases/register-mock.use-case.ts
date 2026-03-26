import { MockDefinition } from "../../domain/entities/mock.entity.js";
import type { NewMockDefinitionProps } from "../../domain/entities/mock.entity.js";
import type { IMockRepository } from "../../domain/interfaces/repositories/mock.repository.js";
import type { IRegisterMockUseCase } from "../../domain/interfaces/use-cases/register-mock.use-case.js";

export class RegisterMockUseCase implements IRegisterMockUseCase {
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
