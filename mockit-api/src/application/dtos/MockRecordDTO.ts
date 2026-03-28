import { randomUUID } from "node:crypto";
import { z } from "zod";
import { MockDTO } from "./MockDTO.js";

const schema = z.object({
  id: z.uuid(),
  mockDTO: z.instanceof(MockDTO),
  createdAt: z.date(),
  updatedAt: z.date(),
});

interface MockRecordDTOProps {
  id: string;
  mockDTO: MockDTO;
  createdAt: Date;
  updatedAt: Date;
}

export class MockRecordDTO {
  public readonly id: string;
  public readonly mockDTO: MockDTO;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor({ id, mockDTO, createdAt, updatedAt }: MockRecordDTOProps) {
    this.id = id;
    this.mockDTO = mockDTO;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validateForResponse();
  }

  public static createNew(mockDTO: MockDTO): MockRecordDTO {
    const now = new Date();

    return new MockRecordDTO({
      id: randomUUID(),
      mockDTO: mockDTO,
      createdAt: now,
      updatedAt: now,
    });
  }

  private validateForResponse() {
    return schema.parse(this);
  }
}
