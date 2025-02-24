import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMessage } from '@hooks/useMessage';

interface UseEntityDetailsProps {
  endpoint: string;
  entityId?: string;
  redirectPath: string;
  fetchOnMount?: boolean;
  onFetchError?: (error: Error) => void;
  onDeleteError?: (error: Error) => void;
}

export const useEntityDetails = <T>({
  endpoint,
  entityId,
  redirectPath,
  fetchOnMount = true,
  onFetchError,
  onDeleteError,
}: UseEntityDetailsProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const messageApi = useMessage();
  const id = entityId || params.id;

  const [entity, setEntity] = useState<T | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`http://localhost:3000${endpoint}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      setEntity(responseData);
    } catch (error) {
      console.error(`Failed to fetch ${endpoint} data:`, error);
      messageApi.error('Échec de la mise à jour');
      onFetchError?.(error as Error);
    }
  }, [id, endpoint, messageApi, onFetchError]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: [id] }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      if (responseData.failedIds && responseData.failedIds.length > 0) {
        throw new Error('Failed to delete some entities');
      }
      navigate(redirectPath);
    } catch (error) {
      console.error(`Failed to delete ${endpoint}:`, error);
      messageApi.error('Échec de la suppression');
      onDeleteError?.(error as Error);
    }
  }, [id, endpoint, navigate, redirectPath, messageApi, onDeleteError]);

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleEditSuccess = useCallback((updatedEntity: T) => {
    setEntity(updatedEntity);
  }, []);

  useEffect(() => {
    if (fetchOnMount) {
      fetchData();
    }
  }, [fetchData, fetchOnMount]);

  return {
    entity,
    fetchData,
    handleDelete,
    handleRefresh,
    handleEditSuccess,
    refreshKey,
  };
};
