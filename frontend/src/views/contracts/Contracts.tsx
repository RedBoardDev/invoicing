import { ROUTE_PATHS } from '@config/routePaths';
import type Contract from '@interfaces/contract';
import { formatDate } from '@utils';
import type { ColumnsType } from 'antd/es/table';
import AddContract from 'components/common/modal/create/AddContract';
import TablePageLayout from 'components/layouts/tablePage/TablePageLayout';
import type React from 'react';
import { useMemo, useState } from 'react';
import type { WithExtends } from '@api/types/extends';
import { getContracts, deleteContracts } from '@api/services/contracts';

const Contracts: React.FC = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const columns: ColumnsType<WithExtends<Contract, 'client'>> = useMemo(
    () => [
      {
        title: 'Titre',
        dataIndex: 'title',
        render: (description: string) => description || 'N/A',
      },
      {
        title: 'Client',
        dataIndex: 'client',
        render: (client) => client?.name || 'N/A',
        sorter: (a, b) => a.client.name.localeCompare(b.client.name),
      },
      {
        title: 'Montant HT',
        dataIndex: 'amountHT',
        render: (value: number) => `€${value.toFixed(2)}`,
        sorter: (a, b) => a.amountHT - b.amountHT,
      },
      {
        title: 'Taux TVA',
        dataIndex: 'taxRate',
        render: (value: number) => `${value.toFixed(2)}%`,
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
      <TablePageLayout<WithExtends<Contract, 'client'>, 'client'>
        title="Contrats"
        listService={getContracts}
        deleteService={deleteContracts}
        detailsRoutePath={(id) => ROUTE_PATHS.private.contracts.detail(id)}
        onAdd={() => setAddModalVisible(true)}
        columns={columns}
        extendsOptions={['client']}
      />
      <AddContract visible={addModalVisible} setVisible={setAddModalVisible} />
    </>
  );
};

export default Contracts;
