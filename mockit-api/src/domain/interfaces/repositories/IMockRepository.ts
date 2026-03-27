import type { Mock } from "../../entities/Mock.js";

export interface IMockRepository {
  insert(mock: Mock): Promise<Mock>;
  getAllByTemplateId(templateId: string): Promise<Mock[]>;
}
