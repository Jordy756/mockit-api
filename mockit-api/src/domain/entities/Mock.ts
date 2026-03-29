interface Props {
  id: string;
  data: Record<string, unknown>;
}

export class Mock {
  public readonly id: string;
  public readonly data: Record<string, unknown>;

  constructor({ id, data }: Props) {
    this.id = id;
    this.data = data;
  }
}
