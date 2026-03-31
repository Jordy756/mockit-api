import { z } from "zod";
import { mockResponseSchema } from "./MockDTO.js";

export const listMockDTOSchema = z.object({
  items: z.array(mockResponseSchema),
  currentPage: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

export type ListMockDTO = z.infer<typeof listMockDTOSchema>;
