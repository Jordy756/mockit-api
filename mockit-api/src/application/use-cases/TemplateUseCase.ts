import { Template } from "../../domain/entities/Template.js";
import type { ITemplateRepository } from "../../domain/interfaces/repositories/ITemplateRepository.js";
import type { ITemplateUseCase } from "../../domain/interfaces/use-cases/ITemplateUseCase.js";

export class TemplateUseCase implements ITemplateUseCase {
  constructor(private readonly templateRepository: ITemplateRepository) {}

  public async insert(): Promise<Template> {
    const newTemplate = new Template();
    return this.templateRepository.insert(newTemplate);
  }

  public async getAll(): Promise<Template[]> {
    return this.templateRepository.getAll();
  }
}
