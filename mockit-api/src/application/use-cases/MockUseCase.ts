import { Mock } from "../../domain/entities/Mock.js";
import type { JsonObject } from "../../domain/entities/Template.js";
import type { ITemplateRepository } from "../../domain/interfaces/repositories/ITemplateRepository.js";
import type { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import type { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockUseCase implements IMockUseCase {
  constructor(
    private readonly templateRepository: ITemplateRepository,
    private readonly mockRepository: IMockRepository,
  ) {}

  public async insert(templateId: string, data: JsonObject): Promise<Mock> {
    const template = await this.templateRepository.getById(templateId);

    if (template === null) {
      throw new Error(`Template with id ${templateId} not found`);
    }

    return this.mockRepository.insert(new Mock(templateId, this.cloneJsonObject(data)));
  }

  public async getAll(templateId: string): Promise<Mock[]> {
    const template = await this.templateRepository.getById(templateId);

    if (template === null) {
      throw new Error(`Template with id ${templateId} not found`);
    }

    const rows = await this.mockRepository.getAllByTemplateId(templateId);
    return rows.map((row) => this.toDetachedMock(row));
  }

  private cloneJsonObject(value: JsonObject): JsonObject {
    return JSON.parse(JSON.stringify(value)) as JsonObject;
  }

  private toDetachedMock(record: Mock): Mock {
    return {
      id: record.id,
      templateId: record.templateId,
      data: this.cloneJsonObject(record.data),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    } as Mock;
  }
}
