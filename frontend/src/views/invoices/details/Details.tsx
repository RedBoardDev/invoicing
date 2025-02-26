import Header from './Header';
import type { TabsProps } from 'antd';
import FocusItem from 'components/layouts/focusItem/FocusItem';
import type React from 'react';
import type Invoice from '@interfaces/invoice';
import { ROUTE_PATHS } from '@config/routePaths';
import { useEntityDetails } from '@hooks/useEntityDetails';

const items: TabsProps['items'] = [];

const InvoicesDetails: React.FC = () => {
  const {
    entity: invoice,
    updateEntity,
    deleteEntity,
    refresh,
  } = useEntityDetails<Invoice>({
    endpoint: '/invoices',
    redirectPath: ROUTE_PATHS.private.invoices.root,
    fetchOnMount: true,
    queryParams: { includeContract: true },
  });

  const tabContent = {
    // items: <ItemsTab key={refreshCount} items={invoice?.items || undefined} />, // TODO a virer non ?
    // TODO voir s'il faut faire un historique des modifs (genre avant le draft puis passage au draft et envoi etc)
  };

  return (
    <FocusItem
      childrenTop={<Header invoice={invoice} onEditSuccess={updateEntity} onDelete={deleteEntity} refresh={refresh} />}
      tabsItems={items}
      tabContent={tabContent}
    />
  );
};

export default InvoicesDetails;
