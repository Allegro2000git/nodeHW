import type {
  BaseQueryParamsInput,
  BlogQueryParamsInput,
  BlogQueryParamsSanitized,
  PostQueryParamsInput,
  PostQueryParamsSanitized,
} from '../types/sortQueryFields.type';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SORT_BY } from '../constants/constants';
import { SortDirections } from '../types/paginationAndSorting';

interface BaseQuerySanitized {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

const getBaseQuery = (query: BaseQueryParamsInput): BaseQuerySanitized => {
  const pageNumber =
    !isNaN(Number(query.pageNumber)) && Number(query.pageNumber) > 0 ? Number(query.pageNumber) : DEFAULT_PAGE;
  const pageSize =
    !isNaN(Number(query.pageSize)) && Number(query.pageSize) > 0 ? Number(query.pageSize) : DEFAULT_PAGE_SIZE;
  const sortBy = query.sortBy ? query.sortBy : DEFAULT_SORT_BY;
  const sortDirection = query.sortDirection === SortDirections.Asc ? SortDirections.Asc : SortDirections.Desc;
  return { pageNumber, pageSize, sortBy, sortDirection };
};

export const queryFieldsUtil = {
  parsePostQuery(query: PostQueryParamsInput): PostQueryParamsSanitized {
    return getBaseQuery(query);
  },
  parseBlogQuery(query: BlogQueryParamsInput): BlogQueryParamsSanitized {
    const base = getBaseQuery(query);
    return {
      ...base,
      searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
    };
  },
};
