import { Template } from "../../domain/entities/Template.js";
import type { JsonValue } from "../../domain/entities/Template.js";
import type { ITemplateRepository } from "../../domain/interfaces/repositories/ITemplateRepository.js";
import type { ITemplateUseCase } from "../../domain/interfaces/use-cases/ITemplateUseCase.js";

export class TemplateUseCase implements ITemplateUseCase {
  constructor(private readonly mockRepository: ITemplateRepository) {}

  public async insert(payload: JsonValue): Promise<Template> {
    // TODO: Consumir un servicio que genere los datos y todo lo demas queda igual

    const newTemplate = new Template(payload);

    return this.mockRepository.insert(newTemplate);
  }

  public async getAll(): Promise<Template[]> {
    return this.mockRepository.getAll();
  }
}
