import { z } from "zod";

const schema = z.object({
  data: z
    .union([z.record(z.string(), z.unknown()), z.array(z.record(z.string(), z.unknown()))])
    .transform((val) => (Array.isArray(val) ? val : [val])),
});

export class MockDTO {
  public readonly data: Record<string, unknown>[];

  constructor(data: Record<string, unknown>[] | Record<string, unknown>) {
    this.data = Array.isArray(data) ? data : [data];
    this.validateForResponse();
  }

  private validateForResponse() {
    return schema.parse(this);
  }
}
