import type { Permissions } from '@api/types/extends';

export interface PaginationParams<TotalCount extends boolean = false> {
  page?: number;
  pageSize?: number;
  totalCount?: TotalCount;
}

export interface BasePaginationMeta {
  pagination: {
    page: number;
    pageSize: number;
  };
}

export type PaginationMeta<
  TotalCount extends boolean = false,
  IncludePermissions extends boolean = false,
> = TotalCount extends true
  ? BasePaginationMeta & { totalCount: number } & (IncludePermissions extends true ? { permissions: Permissions } : {})
  : BasePaginationMeta & (IncludePermissions extends true ? { permissions: Permissions } : {});

export type PaginatedApiResponse<T, TotalCount extends boolean = false, IncludePermissions extends boolean = false> = {
  data: T;
  meta: PaginationMeta<TotalCount, IncludePermissions>;
};
