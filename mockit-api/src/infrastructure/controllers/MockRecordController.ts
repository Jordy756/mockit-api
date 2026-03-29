import type { Request, Response } from "express";
import { ZodError } from "zod";

import { CreateMockRecordDTO } from "../../application/dtos/CreateMockRecordDTO.js";
import { MockRecordMapper } from "../../application/mappers/MockRecordMapper.js";
import type { IMockRecordUseCase } from "../../domain/interfaces/use-cases/IMockRecordUseCase.js";

export class MockRecordController {
  constructor(private readonly mockRecordUseCase: IMockRecordUseCase) {}

  public insert = async (req: Request, res: Response): Promise<void> => {
    try {
      const createDTO = new CreateMockRecordDTO(req.body);
      // const mockRecord = await this.mockRecordUseCase.insert(createDTO);
      // const response = MockRecordMapper.toMockRecordDTO(mockRecord);

      res.status(201).json({
        message: "Mock record inserted successfully",
        createDTO,
      });
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
      const response = MockRecordMapper.toMockRecordDTOs(mockRecords);

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
