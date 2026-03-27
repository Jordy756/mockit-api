import { z } from "zod";
import type { JsonValue } from "../../domain/entities/Template.js";

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

export const registerTemplateInputSchema = jsonValueSchema;

export const registerTemplateResponseSchema = z.object({
  id: z.uuid(),
  endpointsUrl: z.string().min(1),
  payload: jsonValueSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RegisterTemplateInput = z.infer<typeof registerTemplateInputSchema>;
export type RegisterTemplateResponse = z.infer<typeof registerTemplateResponseSchema>;
export { jsonValueSchema };
