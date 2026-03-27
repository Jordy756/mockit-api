import type { Template, JsonValue } from "../../entities/Template.js";

export interface ITemplateUseCase {
  insert(payload: JsonValue): Promise<Template>;
  getAll(): Promise<Template[]>;
}
