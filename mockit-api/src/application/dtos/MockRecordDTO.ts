import { z } from "zod";
import { MockDTO } from "./MockDTO.js";

const schema = z.object({
  id: z.uuid().optional(),
  mocks: z.array(z.instanceof(MockDTO)),
  createdAt: z.date(),
  updatedAt: z.date(),
});

interface MockRecordDTOProps {
  id: string;
  mockDTOs: MockDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export class MockRecordDTO {
  public readonly id: string;
  public readonly mockDTOs: MockDTO[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor({ id, mockDTOs, createdAt, updatedAt }: MockRecordDTOProps) {
    this.id = id;
    this.mockDTOs = mockDTOs;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validateForResponse();
  }

  private validateForResponse() {
    return schema.parse(this);
  }

  // public toJSON() {
  //   return {
  //     id: this.id,
  //     mockDTO: {
  //       data: this.mocks.map((mock) => mock.toJSON()),
  //     },
  //     createdAt: this.createdAt.toISOString(),
  //     updatedAt: this.updatedAt.toISOString(),
  //   };
  // }
}
