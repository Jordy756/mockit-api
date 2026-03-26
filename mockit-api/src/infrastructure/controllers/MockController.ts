import type { Request, Response } from "express";
import { ZodError } from "zod";

import { MockMapper } from "../../application/mappers/MockMapper.js";
import { registerMockInputSchema, registerMockResponseSchema } from "../../application/dtos/MockDTO.js";
import type { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockController {
  constructor(private readonly mockUseCase: IMockUseCase) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = registerMockInputSchema.parse(req.body);
      const payload = MockMapper.toPayload(input);
      const mock = await this.mockUseCase.register(payload);

      const response = registerMockResponseSchema.parse(MockMapper.toMockDTO(mock));

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

  public list = async (req: Request, res: Response): Promise<void> => {
    try {
      const mocks = await this.mockUseCase.list();
      const response = mocks.map(MockMapper.toMockDTO);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        message: "Unexpected error while listing mocks",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
