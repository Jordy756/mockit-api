import type { Request, Response } from "express";
import { ZodError } from "zod";
import { CreateMockDTO } from "../../application/dtos/MockDTO.js";
import { MockMapper } from "../../application/mappers/MockMapper.js";
import { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockController {
  constructor(private readonly mockUseCase: IMockUseCase) {}

  public insert = async (req: Request, res: Response): Promise<void> => {
    try {
      const mockId = Array.isArray(req.params.mockId) ? req.params.mockId[0] : req.params.mockId || "";
      const createDTO = new CreateMockDTO({ data: req.body });

      const mock = await this.mockUseCase.insert(mockId, createDTO);
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
      const mockId = Array.isArray(req.params.mockId) ? req.params.mockId[0] : req.params.mockId || "";
      const mocks = await this.mockUseCase.getAll(mockId);
      const mockDTOs = MockMapper.toMockDTOs(mocks);

      res.status(200).json(mockDTOs);
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
