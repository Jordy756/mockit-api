import { z } from "zod";

import { jsonObjectSchema } from "./TemplateDTO.js";

export const templateIdParamSchema = z.object({
  templateId: z.uuid(),
});

export const insertMockInputSchema = jsonObjectSchema;

export const mockResponseSchema = z.object({
  id: z.uuid(),
  templateId: z.uuid(),
  data: jsonObjectSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TemplateIdParams = z.infer<typeof templateIdParamSchema>;
export type InsertMockInput = z.infer<typeof insertMockInputSchema>;
export type MockResponse = z.infer<typeof mockResponseSchema>;
