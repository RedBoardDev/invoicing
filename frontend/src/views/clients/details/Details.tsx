import type React from 'react';
import Header from './Header';
import type { TabsProps } from 'antd';
import FocusItem from 'components/layouts/focusItem/FocusItem';
import { ROUTE_PATHS } from '@config/routePaths';
import { useEntityDetails } from '@hooks/useEntityDetails';
import { Icon } from '@components/common';
import ContractsTab from '@views/clients/details/ContractsTab';
import type Client from '@interfaces/client';
import { getClientById, deleteClients } from '@api/services/clients';

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
    updateEntity,
    deleteEntity,
    refresh,
    refreshCount,
    permissions,
  } = useEntityDetails<Client, 'contracts' | 'permissions'>({
    redirectPath: ROUTE_PATHS.private.clients.root,
    fetchOnMount: true,
    fetchService: getClientById,
    deleteService: deleteClients,
    extendsOptions: ['contracts', 'permissions'],
  });

  console.log(client)
  const tabContent = {
    contracts: <ContractsTab key={refreshCount} clientId={client?.id || null} />,
  };
  return (
    <FocusItem
      childrenTop={
        <Header
          client={client}
          permissions={permissions}
          onEditSuccess={updateEntity as any}
          onDelete={deleteEntity}
          refresh={refresh}
        />
      }
      tabsItems={items}
      tabContent={tabContent}
    />
  );
};

export default ClientsDetails;
