import { randomUUID } from "node:crypto";
import { z } from "zod";
import { MockDTO } from "./MockDTO.js";

const schema = z.object({
  id: z.uuid(),
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

  public static createNew(inputData: Record<string, unknown> | Record<string, unknown>[]): MockRecordDTO {
    const now = new Date();
    const dataArray = Array.isArray(inputData) ? inputData : [inputData];

    const mocks = dataArray.map((data) => new MockDTO({ data }));

    return new MockRecordDTO({
      id: randomUUID(),
      mocks,
      createdAt: now,
      updatedAt: now,
    });
  }

  private validateForResponse() {
    return schema.parse(this);
  }

  public toJSON() {
    return {
      id: this.id,
      mockDTO: {
        data: this.mocks.map((mock) => mock.toJSON()),
      },
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
