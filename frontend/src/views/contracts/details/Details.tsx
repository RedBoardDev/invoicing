import Header from './Header';
import type { TabsProps } from 'antd';
import FocusItem from 'components/layouts/focusItem/FocusItem';
import type React from 'react';
import { ROUTE_PATHS } from '@config/routePaths';
import { useEntityDetails } from '@hooks/useEntityDetails';
import { Icon } from '@components/common';
import type Contract from '@interfaces/contract';
import InvoicesTab from '@views/contracts/details/InvoicesTab';
import HistoryTab from '@views/contracts/details/HistoryTab';
import type EmailTemplate from '@interfaces/emailTemplate';
import TemplateTab from '@views/contracts/details/TemplateTab';

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
  {
    key: 'template',
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon name="mail" size="15" color="black" />
        Template
      </div>
    ),
  },
];

const ContractsDetails: React.FC = () => {
  const {
    entity: contract,
    isLoading,
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

  const handleTemplateUpdate = (updatedTemplate: EmailTemplate, refreshCallback: () => void) => {
    if (contract) {
      updateEntity({ ...contract, emailTemplate: updatedTemplate });
      refreshCallback();
    }
  };

  const tabContent = {
    invoices: <InvoicesTab key={refreshCount} contractId={contract?.id || null} />,
    history: <HistoryTab key={refreshCount} contractId={contract?.id || null} />,
    template: (
      <TemplateTab
        key={refreshCount}
        emailTemplate={contract?.emailTemplate || null}
        contractId={contract?.id || null}
        isLoading={isLoading}
        onUpdate={handleTemplateUpdate}
        refresh={refresh}
      />
    ),
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
