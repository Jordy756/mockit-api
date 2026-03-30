import type { Request, Response } from "express";
import { ZodError } from "zod";

import { MockRecordMapper } from "../../application/mappers/MockRecordMapper.js";
import type { IMockRecordUseCase } from "../../domain/interfaces/use-cases/IMockRecordUseCase.js";
import { createMockRecordSchema } from "../../application/dtos/MockRecordDTO.js";

export class MockRecordController {
  constructor(private readonly mockRecordUseCase: IMockRecordUseCase) {}

  public insert = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = createMockRecordSchema.parse(req.body);
      const mockRecord = await this.mockRecordUseCase.insert(MockRecordMapper.toEntity(input));
      const response = MockRecordMapper.toResponse(mockRecord);

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
        message: "Unexpected error while inserting mock record row",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const mockRecords = await this.mockRecordUseCase.getAll();
      const response = MockRecordMapper.toResponses(mockRecords);

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
        message: "Unexpected error while listing mock record rows",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
