import type { Request, Response } from "express";
import { ZodError } from "zod";

import { MockMapper } from "../../application/mappers/MockMapper.js";
import { registerMockInputSchema, registerMockResponseSchema } from "../../application/dtos/MockDTO.js";
import type { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockController {
  constructor(private readonly mockUseCase: IMockUseCase) {}

  public register = async (req: Request, res: Response) => {
    try {
      const input = registerMockInputSchema.parse(req.body);
      const mock = await this.mockUseCase.register(MockMapper.toMock(input));

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

      if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        message: "Unexpected error while registering mock",
      });
    }
  };
}
