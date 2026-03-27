import type { Template } from "../../entities/Template.js";
import type { JsonValue } from "../../entities/Template.js";

export interface ITemplateRepository {
  insert(mock: Template): Promise<Template>;
  getAll(): Promise<Template[]>;
}
