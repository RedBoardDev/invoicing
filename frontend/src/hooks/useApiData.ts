import { useCallback, useEffect, useMemo, useState } from 'react';

interface ApiDataState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  total: number;
}

interface ApiDataConfig {
  endpoint: string;
  additionalQueryParams?: Record<string, string | number | boolean>;
  initialPage?: number;
  initialPageSize?: number;
}

export const useApiData = <T extends object>({
  endpoint,
  additionalQueryParams = {},
  initialPage = 1,
  initialPageSize = 30,
}: ApiDataConfig) => {
  const [state, setState] = useState<ApiDataState<T>>({
    data: [],
    loading: false,
    error: null,
    total: 0,
  });

  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: initialPageSize,
  });

  const memoizedAdditionalQueryParams = useMemo(() => additionalQueryParams, [JSON.stringify(additionalQueryParams)]);

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        includeCount: 'true',
        ...memoizedAdditionalQueryParams,
      });

      const response = await fetch(`http://localhost:3000${endpoint}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const { data, meta } = responseData;

      setState({
        data,
        total: meta.totalCount,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: [],
        total: 0,
        loading: false,
        error: error as Error,
      });
    }
  }, [endpoint, pagination.page, pagination.pageSize, memoizedAdditionalQueryParams]);

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
