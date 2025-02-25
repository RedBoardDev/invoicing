import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMessage } from '@hooks/useMessage';

interface EntityDetailsOptions {
  endpoint: string;
  entityId?: string;
  redirectPath: string;
  fetchOnMount?: boolean;
  onFetchError?: (error: Error) => void;
  onDeleteError?: (error: Error) => void;
  queryParams?: Record<string, string | number | boolean>;
}

interface EntityDetailsResult<T> {
  entity: T | null;
  isLoading: boolean;
  fetchEntity: () => Promise<void>;
  deleteEntity: () => Promise<void>;
  refresh: () => void;
  updateEntity: (updatedEntity: T) => void;
  refreshCount: number;
}

export const useEntityDetails = <T>({
  endpoint,
  entityId,
  redirectPath,
  fetchOnMount = true,
  onFetchError,
  onDeleteError,
  queryParams: initialQueryParams,
}: EntityDetailsOptions): EntityDetailsResult<T> => {
  const params = useParams();
  const navigate = useNavigate();
  const messageApi = useMessage();
  const id = entityId || params.id;

  const [entity, setEntity] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const shouldFetchRef = useRef(fetchOnMount);
  const queryParamsRef = useRef(initialQueryParams);

  useEffect(() => {
    queryParamsRef.current = initialQueryParams;
    shouldFetchRef.current = fetchOnMount;
  }, [fetchOnMount, initialQueryParams]);

  const url = useMemo(() => {
    if (!id) return null;
    const baseUrl = new URL(`http://localhost:3000${endpoint}/${id}`);
    const params = queryParamsRef.current;
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        baseUrl.searchParams.append(key, String(value));
      }
    }
    return baseUrl.toString();
  }, [id, endpoint]);

  const handleFetchError = useCallback(
    (error: Error) => {
      console.error(`Failed to fetch ${endpoint} data:`, error);
      messageApi.error('Échec de la mise à jour');
      onFetchError?.(error);
    },
    [endpoint, messageApi, onFetchError],
  );

  const handleDeleteError = useCallback(
    (error: Error) => {
      console.error(`Failed to delete ${endpoint}:`, error);
      messageApi.error('Échec de la suppression');
      onDeleteError?.(error);
    },
    [endpoint, messageApi, onDeleteError],
  );

  const fetchEntity = useCallback(async () => {
    if (!url) return;
    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setEntity(data);
    } catch (error) {
      handleFetchError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [url, handleFetchError]);

  const deleteEntity = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.failedIds?.length > 0) throw new Error('Failed to delete some entities');
      navigate(redirectPath);
    } catch (error) {
      handleDeleteError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [id, endpoint, navigate, redirectPath, handleDeleteError]);

  const refresh = useCallback(() => {
    setRefreshCount((prev) => prev + 1);
    fetchEntity();
  }, [fetchEntity]);

  const updateEntity = useCallback((updatedEntity: T) => {
    setEntity(updatedEntity);
  }, []);

  useEffect(() => {
    if (shouldFetchRef.current && id) {
      fetchEntity();
      shouldFetchRef.current = false;
    }
  }, [id, fetchEntity]);

  return {
    entity,
    isLoading,
    fetchEntity,
    deleteEntity,
    refresh,
    updateEntity,
    refreshCount,
  };
};
