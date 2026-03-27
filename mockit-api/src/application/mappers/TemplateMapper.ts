import type { Template } from "../../domain/entities/Template.js";
import type { RegisterTemplateInput, RegisterTemplateResponse } from "../dtos/TemplateDTO.js";

export class TemplateMapper {
  public static toPayload(input: RegisterTemplateInput) {
    return input;
  }

  public static toTemplateDTO({ id, payload, createdAt, updatedAt }: Template): RegisterTemplateResponse {
    return {
      id,
      endpointsUrl: `/api/mocks/${id}`,
      payload,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  }
}
