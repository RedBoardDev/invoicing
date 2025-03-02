import type EmailTemplate from '@interfaces/emailTemplate';
import { Select } from 'antd';
import type React from 'react';
import { useMemo } from 'react';

interface EmailTemplateSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  templates: EmailTemplate[];
  isLoading: boolean;
}

const EmailTemplateSelect: React.FC<EmailTemplateSelectProps> = ({ value, onChange, templates, isLoading }) => {
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
