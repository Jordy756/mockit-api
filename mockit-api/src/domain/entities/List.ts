export interface ListProps<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
}

export class List<T> {
  public items: T[];
  public currentPage: number;
  public totalPages: number;

  constructor({ items, currentPage, totalPages }: ListProps<T>) {
    this.items = items;
    this.currentPage = currentPage;
    this.totalPages = totalPages;
  }
}
