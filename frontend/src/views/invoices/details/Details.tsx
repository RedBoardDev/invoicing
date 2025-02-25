import Header from './Header';
import type { TabsProps } from 'antd';
import FocusItem from 'components/layouts/focusItem/FocusItem';
import type React from 'react';
import {} from 'react';
import type Invoice from '@interfaces/invoice';
import { ROUTE_PATHS } from '@config/routePaths';
import { useEntityDetails } from '@hooks/useEntityDetails';
import ItemsTab from '@views/invoices/details/ItemsTab';
import { Icon } from '@components/common';

const items: TabsProps['items'] = [
  {
    key: 'items',
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon name="contract" size="15" color="black" />
        Factures
      </div>
    ),
  },
];

const InvoicesDetails: React.FC = () => {
  const {
    entity: invoice,
    handleEditSuccess,
    handleDelete,
    handleRefresh,
    refreshKey,
  } = useEntityDetails<Invoice>({
    endpoint: '/invoices',
    redirectPath: ROUTE_PATHS.private.invoices.root,
    fetchOnMount: true,
  });

  const tabContent = {
    items: <ItemsTab key={refreshKey} items={invoice?.items || undefined} />, // TODO a virer non ?
    // TODO: faire un tab pour afficher le template mail lié au contrat avec affiché la preview simulate du l'email
    // TODO voir s'il faut faire un historique des modifs (genre avant le draft puis passage au draft et envoi etc)
  };

  return (
    <FocusItem
      childrenTop={
        <Header invoice={invoice} onEditSuccess={handleEditSuccess} onDelete={handleDelete} refresh={handleRefresh} />
      }
      tabsItems={items}
      tabContent={tabContent}
    />
  );
};

export default InvoicesDetails;
