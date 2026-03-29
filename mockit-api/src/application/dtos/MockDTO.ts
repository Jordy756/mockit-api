import { z } from "zod";

const schema = z.object({
  id: z.string().uuid(),
  data: z.record(z.string(), z.unknown()),
});

interface Props {
  id: string;
  data: Record<string, unknown>;
}

export class MockDTO {
  public readonly id: string;
  public readonly data: Record<string, unknown>;

  constructor({ id, data }: Props) {
    this.id = id;
    this.data = data;
    this.validateForResponse();
  }

  private validateForResponse() {
    return schema.parse(this);
  }

  // public toJSON() {
  //   return {
  //     ...(this.id ? { id: this.id } : {}),
  //     ...this.data,
  //   };
  // }
}
