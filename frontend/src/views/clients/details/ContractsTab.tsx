import { Loader } from '@components/common';
import type Contract from '@interfaces/contract';
import { formatDate } from '@utils';
import type { ColumnsType } from 'antd/es/table';
import TablePageLayout from 'components/layouts/tablePage/TablePageLayout';
import type React from 'react';
import { useMemo } from 'react';

interface ContractsTabProps {
  contracts: Contract[] | null;
}

const ContractsTab: React.FC<ContractsTabProps> = ({ contracts }) => {
  if (!contracts) return <Loader />;

  const columns: ColumnsType<Contract> = useMemo(
    () => [
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
    <TablePageLayout<Contract> // TODO: plutot séparer la logique call + tableau dans un autre composant comme ça on peut utiliser soit le tableau uniquement soit ce layout qui utilisera le composant tableau
      listEndpoint="/contracts"
      deleteEndpoint="/contracts"
      columns={columns}
      additionalQueryParams={{ includeClient: true }}
      showHeader={false}
    />
  );
};

export default ContractsTab;
