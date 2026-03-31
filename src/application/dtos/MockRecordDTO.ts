import { z } from "zod";
import { mockResponseSchema } from "./MockDTO.js";

export const createMockRecordSchema = z.record(z.string(), z.unknown());

export const mockRecordResponseSchema = z.object({
  id: z.uuid(),
  mocks: z.array(mockResponseSchema),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CreateMockRecordInput = z.infer<typeof createMockRecordSchema>;
export type MockRecordResponse = z.infer<typeof mockRecordResponseSchema>;
