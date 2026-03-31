import type { Request, Response } from "express";
import { Delete, Get, JsonController, Patch, Post, Put, Req, Res } from "routing-controllers";
import { ZodError } from "zod";
import { createMockSchema, updateMockSchema } from "../../application/dtos/MockDTO.js";
import { MockMapper } from "../../application/mappers/MockMapper.js";
import { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

@JsonController("/api/:mockRecordId/mocks")
export class MockController {
  constructor(private readonly mockUseCase: IMockUseCase) {}

  @Post("/")
  public async insert(@Req() req: Request, @Res() res: Response): Promise<void> {
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
  }

  @Put("/:mockId")
  public async update(@Req() req: Request, @Res() res: Response): Promise<void> {
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
  }

  @Patch("/:mockId")
  public async patch(@Req() req: Request, @Res() res: Response): Promise<void> {
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
  }

  @Delete("/:mockId")
  public async delete(@Req() req: Request, @Res() res: Response): Promise<void> {
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
  }

  @Get("/:mockId")
  public async getById(@Req() req: Request, @Res() res: Response): Promise<void> {
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
  }

  @Get("/")
  public async getAll(@Req() req: Request, @Res() res: Response): Promise<void> {
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
  }
}
