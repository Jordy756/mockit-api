import type { Request, Response } from "express";
import { ZodError } from "zod";
import { createMockSchema, updateMockSchema } from "../../application/dtos/MockDTO.js";
import { MockMapper } from "../../application/mappers/MockMapper.js";
import { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockController {
  constructor(private readonly mockUseCase: IMockUseCase) {}

  public insert = async (req: Request, res: Response): Promise<void> => {
    try {
      const mockRecordId = Array.isArray(req.params.mockRecordId)
        ? req.params.mockRecordId[0]
        : req.params.mockRecordId || "";

      const input = createMockSchema.parse(req.body);
      const mock = await this.mockUseCase.insert(mockRecordId, MockMapper.toEntity(input));

      res.status(201).json(MockMapper.toResponse(mock));
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

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const mockRecordId = Array.isArray(req.params.mockRecordId)
        ? req.params.mockRecordId[0]
        : req.params.mockRecordId || "";
      const mockId = Array.isArray(req.params.mockId) ? req.params.mockId[0] : req.params.mockId || "";
      const updateDTO = updateMockSchema.parse(req.body);
      const mock = await this.mockUseCase.update(mockRecordId, mockId, MockMapper.toEntity(updateDTO));

      res.status(200).json(MockMapper.toResponse(mock));
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid request", errors: error.issues });
        return;
      }
      res.status(error instanceof Error && error.message === "Mock not found" ? 404 : 500).json({
        message: "Unexpected error while updating mock",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public patch = async (req: Request, res: Response): Promise<void> => {
    try {
      const mockRecordId = Array.isArray(req.params.mockRecordId)
        ? req.params.mockRecordId[0]
        : req.params.mockRecordId || "";
      const mockId = Array.isArray(req.params.mockId) ? req.params.mockId[0] : req.params.mockId || "";
      const updateDTO = updateMockSchema.parse(req.body);
      const mock = await this.mockUseCase.patch(mockRecordId, mockId, MockMapper.toEntity(updateDTO));

      res.status(200).json(MockMapper.toResponse(mock));
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid request", errors: error.issues });
        return;
      }
      res.status(error instanceof Error && error.message === "Mock not found" ? 404 : 500).json({
        message: "Unexpected error while patching mock",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const mockRecordId = Array.isArray(req.params.mockRecordId)
        ? req.params.mockRecordId[0]
        : req.params.mockRecordId || "";
      const mockId = Array.isArray(req.params.mockId) ? req.params.mockId[0] : req.params.mockId || "";
      const deleted = await this.mockUseCase.delete(mockRecordId, mockId);

      if (!deleted) {
        res.status(404).json({ message: "Mock not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        message: "Unexpected error while deleting mock",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const mockRecordId = Array.isArray(req.params.mockRecordId)
        ? req.params.mockRecordId[0]
        : req.params.mockRecordId || "";
      const mockId = Array.isArray(req.params.mockId) ? req.params.mockId[0] : req.params.mockId || "";
      const mock = await this.mockUseCase.getById(mockRecordId, mockId);

      if (!mock) {
        res.status(404).json({ message: "Mock not found" });
        return;
      }

      res.status(200).json(MockMapper.toResponse(mock));
    } catch (error) {
      res.status(500).json({
        message: "Unexpected error while retrieving mock",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const mockRecordId = Array.isArray(req.params.mockRecordId)
        ? req.params.mockRecordId[0]
        : req.params.mockRecordId || "";

      const mocks = await this.mockUseCase.getAll(mockRecordId);

      res.status(200).json(MockMapper.toResponses(mocks));
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
