export interface IPagination<I> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: I[];
}

export enum SortDirections {
  Asc = 'asc',
  Desc = 'desc',
}
