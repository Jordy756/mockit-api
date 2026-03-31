export class RequestOption {
  public skip?: number;
  public limit?: number;
  public page?: number;
  public field?: string;
  public fieldValue?: string;

  constructor(skip?: number, limit?: number, page?: number, field?: string, fieldValue?: string) {
    this.skip = skip;
    this.limit = limit;
    this.page = page;
    this.field = field;
    this.fieldValue = fieldValue;
  }
}
