import { ROUTE_PATHS } from '@config/routePaths';
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
        title: 'Titre',
        dataIndex: 'title',
        render: (description: string) => description || 'N/A',
      },
      {
        title: 'Client',
        dataIndex: ['client', 'name'],
        render: (_, record) => record.client.name || 'N/A',
        sorter: (a, b) => a.client.name.localeCompare(b.client.name),
      },
      {
        title: 'Montant HT',
        dataIndex: 'amountHT',
        render: (value: string) => `€${Number.parseFloat(value).toFixed(2)}`,
        sorter: (a, b) => a.amountHT - b.amountHT,
      },
      {
        title: 'Taux TVA',
        dataIndex: 'taxRate',
        render: (value: string) => `${Number.parseFloat(value).toFixed(2)}%`,
        sorter: (a, b) => a.taxRate - b.taxRate,
      },
      {
        title: 'Délai paiement',
        dataIndex: 'paymentDelay',
        render: (days: number) => `${days} jours`,
        sorter: (a, b) => a.paymentDelay - b.paymentDelay,
      },
      {
        title: 'Période',
        render: (_, record) => (
          <span>
            {formatDate(record.startDate, 'DD/MM/YYYY')} - {formatDate(record.endDate, 'DD/MM/YYYY')}
          </span>
        ),
        sorter: (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
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
        detailsRoutePath={(id) => ROUTE_PATHS.private.contracts.detail(id)}
        deleteEndpoint="/contracts"
        onAdd={() => setAddModalVisible(true)}
        columns={columns}
        extendsOptions={['client']}
      />

      <AddContract visible={addModalVisible} setVisible={setAddModalVisible} />
    </>
  );
};

export default Contracts;
