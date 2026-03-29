import { z } from "zod";

const schema = z.object({
  data: z.record(z.string(), z.unknown()),
});

export class CreateMockDTO {
  public readonly data: Record<string, unknown>;

  constructor(payload: unknown) {
    const parsed = schema.parse(payload);
    this.data = parsed.data;
  }
}
