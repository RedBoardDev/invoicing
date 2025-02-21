import Header from './Header';
import type { TabsProps } from 'antd';
import FocusItem from 'components/layouts/focusItem/FocusItem';
import type React from 'react';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import Invoice from '@interfaces/invoice';

const InvoicesDetails: React.FC = () => {
  const params = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [itemsRefreshKey, setItemsRefreshKey] = useState<number>(0);
  const refreshItems = () => setItemsRefreshKey((prev) => prev + 1);

  const fetchData = useCallback(async () => {
    const response = await fetch(`http://localhost:3000/invoices/${params.id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    setInvoice(responseData);
  }, [params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const items: TabsProps['items'] = [
    // {
    //   key: 'invoices',
    //   label: (
    //     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    //       <Icon name="contract" size="15" color="black" />
    //       Factures
    //     </div>
    //   ),
    // },
  ];

  const tabContent = {
    // invoices: <InvoicesTab key={itemsRefreshKey} invoices={contract?.invoices || null} />,
    // history tab
  };

  return (
    <FocusItem
      childrenTop={<Header invoice={invoice} refreshItems={refreshItems} />}
      tabsItems={items}
      tabContent={tabContent}
    />
  );
};

export default InvoicesDetails;
