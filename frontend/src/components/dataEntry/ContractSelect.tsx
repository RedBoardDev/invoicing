import type Client from '@interfaces/client';
import type Contract from '@interfaces/contract';
import { Select } from 'antd';
import type React from 'react';
import { useMemo } from 'react';

interface ContractSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  loading?: boolean;
  contracts: (Contract & { client: Client })[];
}

const ContractSelect: React.FC<ContractSelectProps> = ({ value, onChange, loading, contracts }) => {
  const options = useMemo(
    () =>
      contracts.map((c) => ({
        value: c.id,
        label: `${c.client.name} - ${c.title}`,
      })),
    [contracts],
  );

  return (
    <Select
      showSearch
      placeholder="Sélectionnez un contrat"
      optionFilterProp="label"
      loading={loading}
      options={options}
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
      value={value}
      onChange={onChange}
    />
  );
};

export default ContractSelect;
