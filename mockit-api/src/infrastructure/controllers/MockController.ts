import type { Request, Response } from "express";
import { ZodError } from "zod";

import type { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";
import { MockMapper } from "../../application/mappers/MockMapper.js";
import { MockDTO } from "../../application/dtos/MockDTO.js";

export class MockController {
  constructor(private readonly mockUseCase: IMockUseCase) {}

  public insert = async (req: Request, res: Response): Promise<void> => {
    try {
      const mockDTO = new MockDTO({ data: req.body });
      const mock = await this.mockUseCase.insert(MockMapper.toMock(mockDTO));
      const response = MockMapper.toMockDTO(mock);

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
        message: "Unexpected error while inserting mock row",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const mocks = await this.mockUseCase.getAll();
      const response = MockMapper.toMockDTOs(mocks);

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
        message: "Unexpected error while listing mock rows",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
