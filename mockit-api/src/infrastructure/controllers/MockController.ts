import type { Request, Response } from "express";

import {
  mockIdParamSchema,
  mockRuntimeMutationInputSchema,
  mockRuntimeResponseSchema,
} from "../../application/dtos/MockDTO.js";
import type { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockController {
  constructor(private readonly mockUseCase: IMockUseCase) {}

  public insert = async (req: Request, res: Response): Promise<void> => {
    try {
      const { mockId } = mockIdParamSchema.parse(req.params);
      const input = mockRuntimeMutationInputSchema.parse(req.body);
      const state = await this.mockUseCase.insert(mockId, input);
      const response = mockRuntimeResponseSchema.parse({
        mockId: state.mockId,
        state: state.state,
        createdAt: state.createdAt.toISOString(),
        updatedAt: state.updatedAt.toISOString(),
      });

      res.status(200).json(response);
    } catch (error) {
      console.log("Error in insert:", error);
    }
  };

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { mockId } = mockIdParamSchema.parse(req.params);
      const state = await this.mockUseCase.getAll(mockId);
      const response = mockRuntimeResponseSchema.parse({
        mockId: state.mockId,
        state: state.state,
        createdAt: state.createdAt.toISOString(),
        updatedAt: state.updatedAt.toISOString(),
      });

      res.status(200).json(response);
    } catch (error) {
      console.log("Error in getAll:", error);
    }
  };
}
