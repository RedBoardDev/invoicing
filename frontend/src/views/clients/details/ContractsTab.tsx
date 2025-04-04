// frontend/src/views/clients/details/ContractsTab.tsx
import React, { useMemo, useCallback } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { formatDate } from '@utils';
import type Contract from '@interfaces/contract';
import { getClientContracts } from '@api/services/clients';
import { ROUTE_PATHS } from '@config/routePaths';
import { useApiData } from '@hooks/useApiData';
import DataTable from 'components/common/dataTable/DataTable';

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
        sorter: (a, b) => a.title.localeCompare(b.title),
        render: (text: string) => text || 'N/A',
      },
      {
        title: 'Début',
        dataIndex: 'startDate',
        sorter: (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        render: (date: string) => formatDate(date, 'DD/MM/YYYY'),
      },
      {
        title: 'Fin',
        dataIndex: 'endDate',
        sorter: (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
        render: (date: string) => formatDate(date, 'DD/MM/YYYY'),
      },
      {
        title: 'Montant HT',
        dataIndex: 'amountHT',
        sorter: (a, b) => a.amountHT - b.amountHT,
        render: (value: number) => `€${value.toFixed(2)}`,
      },
      {
        title: 'Taux de taxe',
        dataIndex: 'taxRate',
        sorter: (a, b) => a.taxRate - b.taxRate,
        render: (value: number) => `${value.toFixed(2)}%`,
      },
      {
        title: 'Délai paiement',
        dataIndex: 'paymentDelay',
        sorter: (a, b) => a.paymentDelay - b.paymentDelay,
        render: (days: number) => `${days} jours`,
      },
    ],
    [],
  );

  const listService = useCallback(
    (extendsOptions?: 'client'[], pagination?: { page?: number; pageSize?: number; totalCount?: boolean }) =>
      getClientContracts(clientId, extendsOptions, pagination),
    [clientId],
  );

  const { data, loading, error, total, pagination, setPagination } = useApiData<Contract>({
    listService,
    extendsOptions: [],
    initialPageSize: 10,
  });

  const handlePaginationChange = useCallback(
    (page: number, pageSize: number) => {
      setPagination({ page, pageSize });
    },
    [setPagination],
  );

  return (
    <DataTable<Contract>
      dataSource={data}
      loading={loading}
      error={error}
      total={total}
      pagination={{
        current: pagination.page,
        pageSize: pagination.pageSize,
        total,
        onChange: handlePaginationChange,
      }}
      columns={columns}
      detailsRoutePath={(id) => ROUTE_PATHS.private.contracts.detail(id)}
      rowKey="id"
    />
  );
};

export default React.memo(ContractsTab);
