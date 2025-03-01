import { useMessage } from '@hooks/useMessage';
import type EmailTemplate from '@interfaces/emailTemplate';
import { Select } from 'antd';
import type React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getEmailTemplates } from '@api/services/emailTemplates';

interface EmailTemplateSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

const EmailTemplateSelect: React.FC<EmailTemplateSelectProps> = ({ value, onChange }) => {
  const messageApi = useMessage();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getEmailTemplates();
      if (!result.success) throw new Error(result.error || 'Erreur lors de la récupération des templates');
      setTemplates(result.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des templates:', error);
      messageApi.error('Erreur lors du chargement des templates');
    } finally {
      setIsLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const options = useMemo(
    () =>
      templates.map((template) => ({
        value: template.id,
        label: template.name,
      })),
    [templates],
  );

  return (
    <Select
      showSearch
      placeholder="Sélectionnez un template d'email"
      optionFilterProp="label"
      loading={isLoading}
      options={options}
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
      value={value}
      onChange={onChange}
    />
  );
};

export default EmailTemplateSelect;
