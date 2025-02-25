import Header from './Header';
import type { TabsProps } from 'antd';
import FocusItem from 'components/layouts/focusItem/FocusItem';
import type React from 'react';
import { ROUTE_PATHS } from '@config/routePaths';
import { useEntityDetails } from '@hooks/useEntityDetails'; // Chemin vers ton hook
import { Icon } from '@components/common';
import type Contract from '@interfaces/contract';
import InvoicesTab from '@views/contracts/details/InvoicesTab';
import HistoryTab from '@views/contracts/details/HistoryTab';

const items: TabsProps['items'] = [
  {
    key: 'invoices',
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon name="contract" size="15" color="black" />
        Factures
      </div>
    ),
  },
  {
    key: 'history',
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon name="contract" size="15" color="black" />
        Historique
      </div>
    ),
  },
];

const ContractsDetails: React.FC = () => {
  const {
    entity: contract,
    handleEditSuccess,
    handleDelete,
    handleRefresh,
    refreshKey,
  } = useEntityDetails<Contract>({
    endpoint: '/contracts',
    redirectPath: ROUTE_PATHS.private.contracts.root,
    fetchOnMount: true,
  });

  const tabContent = {
    invoices: <InvoicesTab key={refreshKey} contractId={contract?.id || null} />,
    history: <HistoryTab key={refreshKey} contractId={contract?.id || null} />,
    // TODO: faire un tab pour afficher le template mail lié au contrat avec une carte comme dans settings
  };

  return (
    <FocusItem
      childrenTop={
        <Header
          contract={contract}
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

export default ContractsDetails;
