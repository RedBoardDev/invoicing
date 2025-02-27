import Header from './Header';
import type { TabsProps } from 'antd';
import FocusItem from 'components/layouts/focusItem/FocusItem';
import type React from 'react';
import type Invoice from '@interfaces/invoice';
import { ROUTE_PATHS } from '@config/routePaths';
import { useEntityDetails } from '@hooks/useEntityDetails';
import { Icon } from '@components/common';
import PdfViewerTab from '@views/invoices/details/PdfViewerTab';

const items: TabsProps['items'] = [
  {
    key: 'pdf',
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon name="contract" size="15" color="black" />
        PDF
      </div>
    ),
  },
];

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
    pdf: <PdfViewerTab invoice={invoice} />,
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
