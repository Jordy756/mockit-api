import { z } from "zod";

export const createMockSchema = z.record(z.string(), z.unknown());

export const updateMockSchema = z.record(z.string(), z.unknown());

export const mockResponseSchema = z
  .object({
    id: z.uuid(),
  })
  .catchall(z.unknown());

export type CreateMockInput = z.infer<typeof createMockSchema>;
export type UpdateMockInput = z.infer<typeof updateMockSchema>;
export type MockResponse = z.infer<typeof mockResponseSchema>;
