import type { Template } from "../../entities/Template.js";

export interface ITemplateRepository {
  insert(template: Template): Promise<Template>;
  getAll(): Promise<Template[]>;
  getById(templateId: string): Promise<Template | null>;
}
