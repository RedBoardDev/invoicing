import type { PaginationQueryString } from '@entities/pagination-query';
import { ErrorsEnum } from '@enums/errors-enums';
import ApiError from '@libs/error-management/api-error';
import type { FastifyRequest } from 'fastify';

export interface Pagination {
  page: number;
  pageSize: number;
  findId?: string;
}

export interface PaginationParams {
  pagination?: Pagination;
  includeTotalCount: boolean;
}

export interface PaginationQuery {
  skip: number;
  take: number;
}

export interface CursorPaginationQuery {
  cursor?: { id: string };
  skip?: number;
  take: number;
}

export const paginationForQuery = (pagination: Pagination): PaginationQuery => ({
  skip: (pagination.page - 1) * pagination.pageSize,
  take: pagination.pageSize,
});

export const cursorPaginationForQuery = (pagination: Pagination): CursorPaginationQuery => {
  if (pagination.findId) {
    return {
      cursor: { id: pagination.findId },
      skip: 1,
      take: pagination.pageSize,
    };
  }
  return {
    skip: (pagination.page - 1) * pagination.pageSize,
    take: pagination.pageSize,
  };
};

export const paginationForComplexQuery = async (
  pagination: Pagination | undefined,
  countAboveFn: () => Promise<number | undefined>,
): Promise<PaginationQuery | undefined> => {
  if (!pagination) return undefined;
  if (!pagination.findId) {
    return paginationForQuery(pagination);
  }

  const position = await countAboveFn();
  if (position === undefined) {
    throw new ApiError('Item not found', 404, ErrorsEnum.ressourceNotFound);
  }

  const pageNumber = Math.floor(position / pagination.pageSize) + 1;
  const skip = (pageNumber - 1) * pagination.pageSize;

  pagination.page = pageNumber;
  return { skip, take: pagination.pageSize };
};

export const parsePaginationParams = (req: FastifyRequest): PaginationParams => {
  const query = req.query as PaginationQueryString;

  const page = Number.parseInt(query.page ?? '1', 10);
  const pageSize = Number.parseInt(query.pageSize ?? '100', 10);
  const findId = query.findId ?? undefined;
  const includeTotalCount = query.totalCount ?? false;

  if (page < 1 || pageSize < 1) {
    throw new ApiError('Invalid page or pageSize', 400, ErrorsEnum.invalidQueryParameter);
  }

  return { pagination: { page, pageSize, findId }, includeTotalCount };
  // return {
  //   pagination: findId || page > 1 ? { page, pageSize, findId } : undefined,
  //   includeTotalCount,
  // };
};
