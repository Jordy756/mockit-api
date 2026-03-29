import { z } from "zod";
import { MockDTO } from "./MockDTO.js";

const schema = z.object({
  id: z.string().uuid(),
  mocks: z.array(z.instanceof(MockDTO)),
  createdAt: z.date(),
  updatedAt: z.date(),
});

interface MockRecordDTOProps {
  id: string;
  mocks: MockDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export class MockRecordDTO {
  public readonly id: string;
  public readonly mocks: MockDTO[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor({ id, mocks, createdAt, updatedAt }: MockRecordDTOProps) {
    this.id = id;
    this.mocks = mocks;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validateForResponse();
  }

  private validateForResponse() {
    return schema.parse(this);
  }
}
