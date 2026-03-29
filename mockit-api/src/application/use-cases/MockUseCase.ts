import { randomUUID } from "node:crypto";
import { Mock } from "../../domain/entities/Mock.js";
import { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockUseCase implements IMockUseCase {
  constructor(private readonly mockRepository: IMockRepository) {}

  public async insert(recordId: string, input: { data: Record<string, unknown> }): Promise<Mock> {
    const mock = new Mock({ id: randomUUID(), data: input.data });
    return this.mockRepository.insert(recordId, mock);
  }

  public async getAll(recordId: string): Promise<Mock[]> {
    return await this.mockRepository.getAll(recordId);
  }
}
