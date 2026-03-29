import { z } from "zod";

const schema = z.object({
  id: z.uuid().optional(),
  data: z.record(z.string(), z.unknown()),
});

export class MockDTO {
  public readonly id?: string;
  public readonly data: Record<string, unknown>;

  constructor({ id, data }: { id?: string; data: Record<string, unknown> }) {
    this.id = id;
    this.data = data;
    this.validateForResponse();
  }

  private validateForResponse() {
    return schema.parse(this);
  }

  public toJSON() {
    return {
      ...(this.id ? { id: this.id } : {}),
      ...this.data,
    };
  }
}
