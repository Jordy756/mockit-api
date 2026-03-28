import type { Request, Response } from "express";
import { ZodError } from "zod";
import { MockDTO } from "../../application/dtos/MockDTO.js";
import { MockMapper } from "../../application/mappers/MockMapper.js";
import { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockController {
  constructor(private readonly mockUseCase: IMockUseCase) {}

  public insert = async (req: Request, res: Response): Promise<void> => {
    try {
      // const { id } = req.params;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || "";
      const mockDTO = new MockDTO(req.body);

      const template = await this.mockUseCase.insert(id, MockMapper.toMock(mockDTO));
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
      const templates = await this.mockUseCase.getAll();
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
