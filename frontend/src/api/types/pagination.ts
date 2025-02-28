// api/types/pagination.ts
export interface PaginationParams<TotalCount extends boolean = false> {
  page?: number;
  pageSize?: number;
  totalCount?: TotalCount;
}

// Meta de base sans totalCount
export interface BasePaginationMeta {
  pagination: {
    page: number;
    pageSize: number;
  };
}

// Meta avec totalCount si TotalCount est true
export type PaginationMeta<TotalCount extends boolean = false> = TotalCount extends true
  ? BasePaginationMeta & { totalCount: number }
  : BasePaginationMeta;

// Réponse API avec pagination
export type PaginatedApiResponse<T, TotalCount extends boolean = false> = {
  data: T;
  meta: PaginationMeta<TotalCount>;
};
