import { randomUUID } from "node:crypto";
import { z } from "zod";

const schema = z.object({
  id: z.uuid(),
  data: z.record(z.string(), z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

interface MockDTOData {
  id?: string;
  data: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class MockDTO {
  public readonly id: string;
  public readonly data: Record<string, unknown>;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor({ id, data, createdAt, updatedAt }: MockDTOData) {
    const now = new Date();

    this.id = id ?? randomUUID();
    this.data = data;
    this.createdAt = createdAt ?? now;
    this.updatedAt = updatedAt ?? now;

    this.validateForResponse();
  }

  private validateForResponse() {
    return schema.parse(this);
  }
}
