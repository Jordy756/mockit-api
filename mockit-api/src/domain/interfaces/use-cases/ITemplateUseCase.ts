import type { Template } from "../../entities/Template.js";

export interface ITemplateUseCase {
  insert(): Promise<Template>;
  getAll(): Promise<Template[]>;
}
