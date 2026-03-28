import type { Request, Response } from "express";
import { ZodError } from "zod";

import { MockRecordDTO } from "../../application/dtos/MockRecordDTO.js";
import { MockRecordMapper } from "../../application/mappers/MockRecordMapper.js";
import type { IMockRecordUseCase } from "../../domain/interfaces/use-cases/IMockRecordUseCase.js";

export class MockRecordController {
  constructor(private readonly mockRecordUseCase: IMockRecordUseCase) {}

  public insert = async (req: Request, res: Response): Promise<void> => {
    try {
      const mockDTO = new MockRecordDTO({ data: req.body });
      const template = await this.mockRecordUseCase.insert(MockRecordMapper.toMockRecord(mockDTO));
      const response = MockRecordMapper.toMockRecordDTO(template);

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
      const templates = await this.mockRecordUseCase.getAll();
      const response = MockRecordMapper.toMockRecordDTOs(templates);

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
