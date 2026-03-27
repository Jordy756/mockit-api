import type { Template } from "../../domain/entities/Template.js";
import type { TemplateResponse } from "../dtos/TemplateDTO.js";

export class TemplateMapper {
  public static toTemplateDTO({ id, createdAt, updatedAt }: Template): TemplateResponse {
    return {
      id,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  }
}
