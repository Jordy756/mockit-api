import type { Request, Response } from "express";
import { ZodError } from "zod";

import {
  registerTemplateInputSchema,
  registerTemplateResponseSchema
} from "../../application/dtos/TemplateDTO.js";
import { TemplateMapper } from "../../application/mappers/TemplateMapper.js";
import type { ITemplateUseCase } from "../../domain/interfaces/use-cases/ITemplateUseCase.js";

export class TemplateController {
  constructor(private readonly mockUseCase: ITemplateUseCase) {}

  public insert = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = registerTemplateInputSchema.parse(req.body);
      const payload = TemplateMapper.toPayload(input);
      const mock = await this.mockUseCase.insert(payload);

      const response = registerTemplateResponseSchema.parse(TemplateMapper.toTemplateDTO(mock));

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
        message: "Unexpected error while registering mock",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const mocks = await this.mockUseCase.getAll();
      const response = mocks.map(TemplateMapper.toTemplateDTO);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        message: "Unexpected error while listing mocks",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
