import type Client from '@interfaces/client';
import Header from './Header';
import type { TabsProps } from 'antd';
import FocusItem from 'components/layouts/focusItem/FocusItem';
import type React from 'react';
import { ROUTE_PATHS } from '@config/routePaths';
import { useEntityDetails } from '@hooks/useEntityDetails'; // Chemin vers ton hook
import { Icon } from '@components/common';
import ContractsTab from '@views/clients/details/ContractsTab';

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

const ClientsDetails: React.FC = () => {
  const {
    entity: client,
    handleEditSuccess,
    handleDelete,
    handleRefresh,
    refreshKey,
  } = useEntityDetails<Client>({
    endpoint: '/clients',
    redirectPath: ROUTE_PATHS.private.clients.root,
    fetchOnMount: true,
  });

  const tabContent = {
    contracts: <ContractsTab key={refreshKey} clientId={client?.id || null} />,
  };

  return (
    <FocusItem
      childrenTop={
        <Header
          client={client}
          onEditSuccess={handleEditSuccess}
          onDelete={handleDelete}
          refresh={handleRefresh}
        />
      }
      tabsItems={items}
      tabContent={tabContent}
    />
  );
};

export default ClientsDetails;
