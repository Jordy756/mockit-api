import { z } from "zod";

const schema = z.object({
  mocks: z
    .array(z.record(z.string(), z.unknown()))
    .min(1, "At least one mock is required")
    .max(50, "Maximum 50 mocks allowed per request"),
});

export class CreateMockRecordDTO {
  public readonly mockDTOs: Record<string, unknown>[];

  constructor(data: unknown) {
    const parsed = schema.parse(data);
    this.mockDTOs = parsed.mocks;
  }
}
