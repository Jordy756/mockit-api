import { z } from "zod";
import { GetMockDTO } from "./MockDTO.js";

const createMockRecordSchema = z.record(z.string(), z.unknown());

const getMockRecordSchema = z.object({
  id: z.uuid(),
  mocks: z.array(z.instanceof(GetMockDTO)),
  createdAt: z.date(),
  updatedAt: z.date(),
});

interface MockRecordDTOProps {
  id: string;
  mocks: GetMockDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export class CreateMockRecordDTO {
  public readonly mockDTO: Record<string, unknown>;

  constructor(data: Record<string, unknown>) {
    const parsed = createMockRecordSchema.parse(data);
    this.mockDTO = parsed;
  }
}

export class GetMockRecordDTO {
  public readonly id: string;
  public readonly mocks: GetMockDTO[];
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
    return getMockRecordSchema.parse(this);
  }

  public toJSON() {
    return {
      id: this.id,
      mocks: this.mocks.map((mock) => mock.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
