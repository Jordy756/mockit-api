import { z } from "zod";

import type { JsonValue } from "../../domain/entities/Template.js";

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

export const registerTemplateInputSchema = z.object({}).strict();

export const templateResponseSchema = z.object({
  id: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RegisterTemplateInput = z.infer<typeof registerTemplateInputSchema>;
export type TemplateResponse = z.infer<typeof templateResponseSchema>;
