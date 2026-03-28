import { randomUUID } from "node:crypto";
import { z } from "zod";
import { MockDTO } from "./MockDTO.js";

const schema = z.object({
  id: z.uuid(),
  data: z.record(z.string(), z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class MockRecordDTO {
  public readonly id: string;
  public readonly mockDTO: MockDTO;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(data: Record<string, unknown>) {
    const now = new Date();

    this.id = randomUUID();
    this.mockDTO = new MockDTO(data);
    this.createdAt = now;
    this.updatedAt = now;

    this.validateForResponse();
  }

  private validateForResponse() {
    return schema.parse(this);
  }
}
