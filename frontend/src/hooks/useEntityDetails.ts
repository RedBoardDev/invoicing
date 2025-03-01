import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMessage } from '@hooks/useMessage';
import type { WithExtends } from '@api/types/extends';
import type { Result, ApiResponse } from '@api/types/fetch';

interface EntityDetailsOptions<T, E extends string> {
  entityId?: string;
  redirectPath: string;
  fetchOnMount?: boolean;
  fetchService: (id: string, extendsOptions?: E[]) => Promise<Result<ApiResponse<WithExtends<T, E>>>>;
  deleteService: (
    ids: string[],
  ) => Promise<Result<ApiResponse<{ deletedIds: string[]; failedIds: { id: string; reason: string }[] }>>>;
  extendsOptions?: E[];
  onFetchError?: (error: Error) => void;
  onDeleteError?: (error: Error) => void;
}

interface EntityDetailsResult<T, E extends string> {
  entity: WithExtends<T, E> | null;
  isLoading: boolean;
  fetchEntity: () => Promise<void>;
  deleteEntity: () => Promise<void>;
  refresh: () => void;
  updateEntity: (updatedEntity: WithExtends<T, E>) => void;
  refreshCount: number;
}

export const useEntityDetails = <T extends object, E extends string = never>({
  entityId,
  redirectPath,
  fetchOnMount = true,
  fetchService,
  deleteService,
  extendsOptions = [],
  onFetchError,
  onDeleteError,
}: EntityDetailsOptions<T, E>): EntityDetailsResult<T, E> => {
  const params = useParams();
  const navigate = useNavigate();
  const messageApi = useMessage();
  const id = entityId || params.id;

  const [entity, setEntity] = useState<WithExtends<T, E> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const shouldFetchRef = useRef(fetchOnMount);

  useEffect(() => {
    shouldFetchRef.current = fetchOnMount;
  }, [fetchOnMount]);

  const handleFetchError = useCallback(
    (error: Error) => {
      console.error('Failed to fetch entity data:', error);
      messageApi.error('Échec de la récupération des données');
      onFetchError?.(error);
    },
    [messageApi, onFetchError],
  );

  const handleDeleteError = useCallback(
    (error: Error) => {
      console.error('Failed to delete entity:', error);
      messageApi.error('Échec de la suppression');
      onDeleteError?.(error);
    },
    [messageApi, onDeleteError],
  );

  const fetchEntity = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const result = await fetchService(id, extendsOptions);
      if (!result.success) throw new Error(result.error || 'Erreur lors de la récupération');
      setEntity(result.data.data);
    } catch (error) {
      handleFetchError(error instanceof Error ? error : new Error('Erreur inconnue'));
    } finally {
      setIsLoading(false);
    }
  }, [id, fetchService, extendsOptions, handleFetchError]);

  const deleteEntity = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const result = await deleteService([id]);
      if (!result.success) throw new Error(result.error || 'Erreur lors de la suppression');
      const { failedIds } = result.data.data;
      if (failedIds?.length > 0) throw new Error('Échec de la suppression de certains éléments');
      navigate(redirectPath);
    } catch (error) {
      handleDeleteError(error instanceof Error ? error : new Error('Erreur inconnue'));
    } finally {
      setIsLoading(false);
    }
  }, [id, deleteService, navigate, redirectPath, handleDeleteError]);

  const refresh = useCallback(() => {
    setRefreshCount((prev) => prev + 1);
    fetchEntity();
  }, [fetchEntity]);

  const updateEntity = useCallback((updatedEntity: WithExtends<T, E>) => {
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
