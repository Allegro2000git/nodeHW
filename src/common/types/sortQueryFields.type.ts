// То, что может прислать клиент
export interface BaseQueryParamsInput {
  pageNumber?: string;
  pageSize?: string;
  sortBy?: string;
  sortDirection?: string;
}

export interface BlogQueryParamsInput extends BaseQueryParamsInput {
  searchNameTerm?: string;
}

export interface PostQueryParamsInput extends BaseQueryParamsInput {}

// То, с чем работает бд
export type BlogQueryParamsSanitized = {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pageNumber: number;
  pageSize: number;
};

export type PostQueryParamsSanitized = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
};
