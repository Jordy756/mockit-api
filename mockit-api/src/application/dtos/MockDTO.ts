import { z } from "zod";

import { jsonValueSchema } from "./TemplateDTO.js";

export const mockIdParamSchema = z.object({
  mockId: z.uuid(),
});

export const mockRuntimeMutationInputSchema = jsonValueSchema;

export const mockRuntimeResponseSchema = z.object({
  mockId: z.uuid(),
  state: jsonValueSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type MockRuntimeMutationInput = z.infer<typeof mockRuntimeMutationInputSchema>;
export type MockRuntimeResponse = z.infer<typeof mockRuntimeResponseSchema>;
