import { z } from "zod";

const schema = z.object({
  data: z.array(z.record(z.string(), z.unknown())),
});

export class MockDTO {
  public readonly data: Record<string, unknown>[];

  constructor(data: Record<string, unknown>[]) {
    this.data = data;
    this.validateForResponse();
  }

  private validateForResponse() {
    return schema.parse(this);
  }
}
