interface Props {
  id: string;
  data: Record<string, unknown>;
}

export class Mock {
  public id: string;
  public data: Record<string, unknown>;

  constructor({ id, data }: Props) {
    this.id = id;
    this.data = data;
  }
}
