export class Mock {
  public readonly id: string;
  public readonly data: Record<string, unknown>;

  constructor({ id, data }: { id: string; data: Record<string, unknown> }) {
    this.id = id;
    this.data = data;
  }
}
