import { z } from "zod";

export const getAllMocksInputSchema = z
  .object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10),
    field: z.string().optional(),
    fieldValue: z.string().optional(),
  })
  .refine(
    (data) => {
      // Both field and fieldValue must be provided together, or both must be absent
      const hasField = data.field !== undefined && data.field !== "";
      const hasFieldValue = data.fieldValue !== undefined && data.fieldValue !== "";

      return hasField === hasFieldValue;
    },
    {
      message: "field and fieldValue must be provided together or both must be absent",
      path: ["field", "fieldValue"],
    },
  );

export type GetAllMocksInput = z.infer<typeof getAllMocksInputSchema>;
