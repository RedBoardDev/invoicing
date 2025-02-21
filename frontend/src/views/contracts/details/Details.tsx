import Header from './Header';
import type { TabsProps } from 'antd';
import FocusItem from 'components/layouts/focusItem/FocusItem';
import type React from 'react';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@components/common';
import type Contract from '@interfaces/contract';
import InvoicesTab from '@views/contracts/details/InvoicesTab';
import HistoryTab from '@views/contracts/details/HistoryTab';

const ContractsDetails: React.FC = () => {
  const params = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const [invoicesRefreshKey, setInvoicesRefreshKey] = useState<number>(0);
  const refreshInvoices = () => setInvoicesRefreshKey((prev) => prev + 1);

  const fetchData = useCallback(async () => {
    const response = await fetch(
      `http://localhost:3000/contracts/${params.id}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    setContract(responseData);
  }, [params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const tabContent = {
    invoices: <InvoicesTab key={invoicesRefreshKey} contractId={contract?.id || null} />,
    history: <HistoryTab key={invoicesRefreshKey} contractId={contract?.id || null} />,
  };

  return (
    <FocusItem
      childrenTop={<Header contract={contract} refreshInvoices={refreshInvoices} />}
      tabsItems={items}
      tabContent={tabContent}
    />
  );
};

export default ContractsDetails;
