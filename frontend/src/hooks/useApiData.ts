import { useCallback, useEffect, useMemo, useState } from 'react';
import type { WithExtends } from '@api/types/extends';
import type { Result } from '@api/types/fetch';
import type { PaginatedApiResponse } from '@api/types/pagination';

interface ApiDataState<T, E extends string> {
  data: Array<WithExtends<T, E>>;
  loading: boolean;
  error: Error | null;
  total: number;
}

interface ApiDataConfig<T, E extends string> {
  listService: (
    extendsOptions?: E[],
    pagination?: { page?: number; pageSize?: number; totalCount?: boolean },
  ) => Promise<Result<PaginatedApiResponse<WithExtends<T, E>[], true>>>;
  extendsOptions?: E[];
  initialPage?: number;
  initialPageSize?: number;
}

export const useApiData = <T extends object, E extends string = never>({
  listService,
  extendsOptions = [],
  initialPage = 1,
  initialPageSize = 30,
}: ApiDataConfig<T, E>) => {
  const [state, setState] = useState<ApiDataState<T, E>>({
    data: [],
    loading: false,
    error: null,
    total: 0,
  });

  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: initialPageSize,
  });

  const memoizedExtendsOptions = useMemo(() => extendsOptions, [JSON.stringify(extendsOptions)]);

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const result = await listService(memoizedExtendsOptions, {
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalCount: true,
      });

      if (!result.success) throw new Error(result.error || 'Erreur lors de la récupération des données');

      const { data, meta } = result.data;
      setState({
        data,
        total: meta?.totalCount ?? 0,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: [],
        total: 0,
        loading: false,
        error: error instanceof Error ? error : new Error('Erreur inconnue'),
      });
    }
  }, [listService, pagination.page, pagination.pageSize, memoizedExtendsOptions]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    pagination,
    setPagination,
    refresh: fetchData,
  };
};
