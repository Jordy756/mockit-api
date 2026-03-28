import { Mock } from "../../domain/entities/Mock.js";
import type { ITemplateRepository } from "../../domain/interfaces/repositories/ITemplateRepository.js";
import type { ITemplateUseCase } from "../../domain/interfaces/use-cases/ITemplateUseCase.js";

export class TemplateUseCase implements ITemplateUseCase {
  constructor(private readonly templateRepository: ITemplateRepository) {}

  public async insert(mock: Mock): Promise<Mock> {
    return this.templateRepository.insert(mock);
  }

  public async getAll(): Promise<Mock[]> {
    return await this.templateRepository.getAll();
  }
}
