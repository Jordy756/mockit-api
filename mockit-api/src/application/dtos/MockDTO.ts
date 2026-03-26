import { z } from "zod";
import { HTTP_METHOD, type JsonValue } from "../../domain/entities/Mock.js";

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

const METHOD_VALUES = [
  HTTP_METHOD.GET,
  HTTP_METHOD.POST,
  HTTP_METHOD.PUT,
  HTTP_METHOD.PATCH,
  HTTP_METHOD.DELETE,
] as const;

export const registerMockInputSchema = z.object({
  name: z.string().trim().min(1, { error: "name is required" }),
  method: z.enum(METHOD_VALUES),
  path: z.string().trim().min(1, { error: "path is required" }).regex(/^\//, { error: "path must start with '/'" }),
  statusCode: z.number().int().min(100).max(599).default(200),
  responseBody: jsonValueSchema,
  headers: z.record(z.string(), z.string()).default({}),
  delayMs: z.number().int().min(0).max(30_000).default(0),
  isActive: z.boolean().default(true),
});

export const registerMockResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  method: z.enum(METHOD_VALUES),
  path: z.string(),
  statusCode: z.number().int(),
  responseBody: jsonValueSchema,
  headers: z.record(z.string(), z.string()),
  delayMs: z.number().int(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RegisterMockInput = z.infer<typeof registerMockInputSchema>;
export type RegisterMockResponse = z.infer<typeof registerMockResponseSchema>;
