export interface PageableQuery {
  page?: number;
  size?: number;
}

export interface Page<T> extends Required<PageableQuery> {
  total: number;
  pages: number;
  items: T[];
}
