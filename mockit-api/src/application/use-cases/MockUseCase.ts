import { randomUUID } from "node:crypto";
import { List } from "../../domain/entities/List.js";
import { Mock } from "../../domain/entities/Mock.js";
import { RequestOption } from "../../domain/entities/RequestOption.js";
import { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockUseCase implements IMockUseCase {
  constructor(private readonly mockRepository: IMockRepository) {}

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

  public async getAll(mockRecordId: string, requestOption?: RequestOption): Promise<List<Mock>> {
    return await this.mockRepository.getAll(mockRecordId, requestOption);
  }
}
