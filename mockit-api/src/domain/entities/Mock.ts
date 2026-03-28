interface MockData {
  id: string;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class Mock {
  public readonly id: string;
  public readonly data: Record<string, unknown>;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor({ id, data, createdAt, updatedAt }: MockData) {
    this.id = id;
    this.data = data;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
  }
}
