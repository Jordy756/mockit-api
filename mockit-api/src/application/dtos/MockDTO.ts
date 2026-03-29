import { z } from "zod";

const createMockSchema = z.object({
  data: z.record(z.string(), z.unknown()),
});

const getMockSchema = z.object({
  id: z.uuid(),
  data: z.record(z.string(), z.unknown()),
});

interface Props {
  id: string;
  data: Record<string, unknown>;
}

export class CreateMockDTO {
  public readonly data: Record<string, unknown>;

  constructor(payload: unknown) {
    const parsed = createMockSchema.parse(payload);
    this.data = parsed.data;
  }
}

export class GetMockDTO {
  public readonly id: string;
  public readonly data: Record<string, unknown>;

  constructor({ id, data }: Props) {
    this.id = id;
    this.data = data;
    this.validateForResponse();
  }

  private validateForResponse() {
    return getMockSchema.parse(this);
  }

  public toJSON() {
    return {
      id: this.id,
      ...this.data,
    };
  }
}
