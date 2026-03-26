import { z } from "zod";
import type { JsonValue } from "../../domain/entities/Mock.js";

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

export const registerMockInputSchema = jsonValueSchema;

export const registerMockResponseSchema = z.object({
  id: z.uuid(),
  payload: jsonValueSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RegisterMockInput = z.infer<typeof registerMockInputSchema>;
export type RegisterMockResponse = z.infer<typeof registerMockResponseSchema>;
