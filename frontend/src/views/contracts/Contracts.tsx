import type Client from '@interfaces/clients';
import type Contract from '@interfaces/contract';
import { formatDate } from '@utils';
import type { ColumnsType } from 'antd/es/table';
import AddContract from 'components/common/modal/create/AddContract';
import TablePageLayout from 'components/layouts/tablePage/TablePageLayout';
import type React from 'react';
import { useMemo, useState } from 'react';

const Contracts: React.FC = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const columns: ColumnsType<Contract> = useMemo(
    () => [
      {
        title: 'Client',
        dataIndex: 'client',
        render: (client: Client) => client.name || 'N/A',
        sorter: (a, b) => {
          const nameA = a.client.name || '';
          const nameB = b.client.name || '';
          return nameA.localeCompare(nameB);
        },
      },
      {
        title: 'Début',
        dataIndex: 'startDate',
        render: (date: string) => formatDate(date, 'DD/MM/YYYY'),
        sorter: (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      },
      {
        title: 'Fin',
        dataIndex: 'endDate',
        render: (date: string) => formatDate(date, 'DD/MM/YYYY'),
        sorter: (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
      },
      {
        title: 'Montant HT',
        dataIndex: 'amountHT',
        render: (value: string) => `€${Number.parseFloat(value).toFixed(2)}`,
        sorter: (a, b) => Number.parseFloat(a.amountHT) - Number.parseFloat(b.amountHT),
      },
      {
        title: 'Taux de taxe',
        dataIndex: 'taxRate',
        render: (value: string) => `${Number.parseFloat(value).toFixed(2)}%`,
        sorter: (a, b) => Number.parseFloat(a.taxRate) - Number.parseFloat(b.taxRate),
      },
      {
        title: 'Délai paiement',
        dataIndex: 'paymentDelay',
        render: (days: number) => `${days} jours`,
        sorter: (a, b) => a.paymentDelay - b.paymentDelay,
      },
      {
        title: 'Créé le',
        dataIndex: 'createdAt',
        render: (date: string) => formatDate(date, 'DD/MM/YYYY'),
        sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      },
    ],
    [],
  );

  return (
    <>
      <TablePageLayout<Contract>
        title="Contrats"
        listEndpoint="/contracts"
        deleteEndpoint="/contracts"
        onAdd={() => setAddModalVisible(true)}
        columns={columns}
        additionalQueryParams={{ includeClient: true }}
      />

      <AddContract visible={addModalVisible} setVisible={setAddModalVisible} />
    </>
  );
};

export default Contracts;
