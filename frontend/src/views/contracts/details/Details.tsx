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
    updateEntity,
    deleteEntity,
    refresh,
    refreshCount,
  } = useEntityDetails<Contract>({
    endpoint: '/contracts',
    redirectPath: ROUTE_PATHS.private.contracts.root,
    fetchOnMount: true,
    queryParams: { includeEmailTemplate: true },
  });

  const tabContent = {
    invoices: <InvoicesTab key={refreshCount} contractId={contract?.id || null} />,
    history: <HistoryTab key={refreshCount} contractId={contract?.id || null} />,
    // TODO: faire un tab pour afficher le template mail lié au contrat avec une carte comme dans settings
  };

  return (
    <FocusItem
      childrenTop={
        <Header contract={contract} onEditSuccess={updateEntity} onDelete={deleteEntity} refresh={refresh} />
      }
      tabsItems={items}
      tabContent={tabContent}
    />
  );
};

export default ContractsDetails;
