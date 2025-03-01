import { useMessage } from '@hooks/useMessage';
import type Client from '@interfaces/client';
import { Select } from 'antd';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getClients } from '@api/services/clients';

interface ClientSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

const ClientSelect: React.FC<ClientSelectProps> = ({ value, onChange }) => {
  const messageApi = useMessage();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getClients();
      if (!result.success) throw new Error(result.error || 'Erreur lors de la récupération des clients');
      setClients(result.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      messageApi.error('Erreur lors du chargement des clients');
    } finally {
      setIsLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const options = useMemo(
    () =>
      clients.map((client) => ({
        value: client.id,
        label: client.name,
      })),
    [clients],
  );

  return (
    <Select
      showSearch
      placeholder="Sélectionnez un client"
      optionFilterProp="label"
      loading={isLoading}
      options={options}
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
      value={value}
      onChange={onChange}
    />
  );
};

export default ClientSelect;
