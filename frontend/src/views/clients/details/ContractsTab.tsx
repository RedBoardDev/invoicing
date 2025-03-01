import { ROUTE_PATHS } from '@config/routePaths';
import type Contract from '@interfaces/contract';
import { formatDate } from '@utils';
import type { ColumnsType } from 'antd/es/table';
import TablePageLayout from 'components/layouts/tablePage/TablePageLayout';
import type React from 'react';
import { useMemo } from 'react';
import { getClientContracts } from '@api/services/clients';

interface ContractsTabProps {
  clientId: string | null;
}

const ContractsTab: React.FC<ContractsTabProps> = ({ clientId }) => {
  if (!clientId) return null;

  const columns: ColumnsType<Contract> = useMemo(
    () => [
      {
        title: 'Titre',
        dataIndex: 'title',
        render: (description: string) => description || 'N/A',
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
        render: (value: number) => `€${value.toFixed(2)}`,
        sorter: (a, b) => a.amountHT - b.amountHT,
      },
      {
        title: 'Taux de taxe',
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
    ],
    [],
  );

  const listService = (
    extendsOptions?: 'client'[],
    pagination?: { page?: number; pageSize?: number; totalCount?: boolean },
  ) => getClientContracts(clientId, extendsOptions, pagination);

  return (
    <TablePageLayout<Contract>
      listService={listService}
      columns={columns}
      detailsRoutePath={(id) => ROUTE_PATHS.private.contracts.detail(id)}
      showHeader={false}
    />
  );
};

export default ContractsTab;
