import type { Request, Response } from "express";
import { ZodError } from "zod";

import { insertMockInputSchema, mockResponseSchema, templateIdParamSchema } from "../../application/dtos/MockDTO.js";
import type { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockController {
  constructor(private readonly mockUseCase: IMockUseCase) {}

  public insert = async (req: Request, res: Response): Promise<void> => {
    try {
      const { templateId } = templateIdParamSchema.parse(req.params);
      const input = insertMockInputSchema.parse(req.body);
      const mock = await this.mockUseCase.insert(templateId, input);

      const response = mockResponseSchema.parse({
        id: mock.id,
        templateId: mock.templateId,
        data: mock.data,
        createdAt: mock.createdAt.toISOString(),
        updatedAt: mock.updatedAt.toISOString(),
      });

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
      const { templateId } = templateIdParamSchema.parse(req.params);
      const mocks = await this.mockUseCase.getAll(templateId);

      const response = mocks.map((mock) =>
        mockResponseSchema.parse({
          id: mock.id,
          templateId: mock.templateId,
          data: mock.data,
          createdAt: mock.createdAt.toISOString(),
          updatedAt: mock.updatedAt.toISOString(),
        }),
      );

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Invalid params",
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
