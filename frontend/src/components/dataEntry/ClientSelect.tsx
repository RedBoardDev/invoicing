import type Client from '@interfaces/clients';
import { Select } from 'antd';
import { useMemo } from 'react';

interface ClientSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  loading?: boolean;
  clients: Client[];
}

const ClientSelect: React.FC<ClientSelectProps> = ({ value, onChange, loading, clients }) => {
  const options = useMemo(
    () =>
      clients.map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [clients],
  );

  return (
    <Select
      showSearch
      placeholder="Sélectionnez un client"
      optionFilterProp="label"
      loading={loading}
      options={options}
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
      value={value}
      onChange={onChange}
    />
  );
};

export default ClientSelect;
