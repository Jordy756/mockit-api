import type { Request, Response } from "express";
import { ZodError } from "zod";

import type { ITemplateUseCase } from "../../domain/interfaces/use-cases/ITemplateUseCase.js";
import { MockMapper } from "../../application/mappers/MockMapper.js";
import { MockDTO } from "../../application/dtos/MockDTO.js";

export class TemplateController {
  constructor(private readonly templateUseCase: ITemplateUseCase) {}

  public insert = async (req: Request, res: Response): Promise<void> => {
    try {
      const mockDTO = new MockDTO({ data: req.body });
      const template = await this.templateUseCase.insert(MockMapper.toMock(mockDTO));
      const response = MockMapper.toMockDTO(template);

      res.status(201).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Invalid request",
          errors: error.issues,
        });
        return;
      }

      res.status(500).json({
        message: "Unexpected error while inserting template row",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const templates = await this.templateUseCase.getAll();
      const response = MockMapper.toMockDTOs(templates);

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Invalid request",
          errors: error.issues,
        });
        return;
      }

      res.status(500).json({
        message: "Unexpected error while listing template rows",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
