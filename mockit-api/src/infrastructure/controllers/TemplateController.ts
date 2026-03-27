import type { Request, Response } from "express";
import { ZodError } from "zod";

import { registerTemplateInputSchema, templateResponseSchema } from "../../application/dtos/TemplateDTO.js";
import { TemplateMapper } from "../../application/mappers/TemplateMapper.js";
import type { ITemplateUseCase } from "../../domain/interfaces/use-cases/ITemplateUseCase.js";

export class TemplateController {
  constructor(private readonly templateUseCase: ITemplateUseCase) {}

  public insert = async (req: Request, res: Response): Promise<void> => {
    try {
      registerTemplateInputSchema.parse(req.body ?? {});
      const template = await this.templateUseCase.insert();
      const response = templateResponseSchema.parse(TemplateMapper.toTemplateDTO(template));

      res.status(201).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Invalid payload",
          errors: error.issues,
        });
        return;
      }

      res.status(500).json({
        message: "Unexpected error while creating template",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const templates = await this.templateUseCase.getAll();
      const response = templates.map((template) =>
        templateResponseSchema.parse(TemplateMapper.toTemplateDTO(template)),
      );
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        message: "Unexpected error while listing templates",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
