import type Client from '@interfaces/client';
import Header from './Header';
import type { TabsProps } from 'antd';
import FocusItem from 'components/layouts/focusItem/FocusItem';
import type React from 'react';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@components/common';
import ContractsTab from '@views/clients/details/ContractsTab';

const ClientsDetails: React.FC = () => {
  const params = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [contractsRefreshKey, setContractsRefreshKey] = useState<number>(0);
  const refreshContracts = () => setContractsRefreshKey((prev) => prev + 1);

  const fetchData = useCallback(async () => {
    const response = await fetch(`http://localhost:3000/clients/${params.id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    setClient(responseData);
  }, [params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const items: TabsProps['items'] = [
    {
      key: 'contracts',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="contract" size="15" color="black" />
          Contrats
        </div>
      ),
    },
  ];

  const tabContent = {
    contracts: <ContractsTab key={contractsRefreshKey} clientId={client?.id || null}/>,
  };

  return (
    <FocusItem
      childrenTop={<Header client={client} refreshContracts={refreshContracts} />}
      tabsItems={items}
      tabContent={tabContent}
    />
  );
};

export default ClientsDetails;
