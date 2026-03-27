import { z } from "zod";

import type { JsonValue } from "../../domain/entities/Mock.js";

export const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

export const jsonObjectSchema = z.record(z.string(), jsonValueSchema);

export const insertMockInputSchema = jsonObjectSchema;

export const mockResponseSchema = z.object({
  id: z.uuid(),
  data: jsonObjectSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type InsertMockInput = z.infer<typeof insertMockInputSchema>;
export type MockResponse = z.infer<typeof mockResponseSchema>;
