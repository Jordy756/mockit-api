import type { Mock } from "../../entities/Mock.js";
import type { JsonObject } from "../../entities/Template.js";

export interface IMockUseCase {
  insert(templateId: string, data: JsonObject): Promise<Mock>;
  getAll(templateId: string): Promise<Mock[]>;
}
