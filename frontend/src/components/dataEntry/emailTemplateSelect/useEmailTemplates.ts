import { useState, useEffect, useCallback } from 'react';
import { useMessage } from '@hooks/useMessage';
import type EmailTemplate from '@interfaces/emailTemplate';
import { getEmailTemplates } from '@api/services/emailTemplates';

interface UseEmailTemplatesProps {
  fetchOnMount?: boolean;
}

interface UseEmailTemplatesResult {
  templates: EmailTemplate[];
  isLoading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
}

export const useEmailTemplates = ({ fetchOnMount = false }: UseEmailTemplatesProps = {}): UseEmailTemplatesResult => {
  const messageApi = useMessage();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getEmailTemplates();
      if (!result.success) throw new Error(result.error || 'Erreur lors de la récupération des templates');
      setTemplates(result.data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      messageApi.error('Erreur lors du chargement des templates');
    } finally {
      setIsLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    if (fetchOnMount) {
      fetchTemplates();
    }
  }, [fetchOnMount, fetchTemplates]);

  return { templates, isLoading, error, fetchTemplates };
};
