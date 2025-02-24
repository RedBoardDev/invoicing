import { Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CHANGE_TYPE_COLORS, CHANGE_TYPE_DESCRIPTIONS, type ContractHistory } from '@interfaces/contractHistory';
import { formatDate } from '@utils';
import TablePageLayout from 'components/layouts/tablePage/TablePageLayout';
import type React from 'react';
import { useMemo } from 'react';

const { Text } = Typography;

interface HistoryTabProps {
  contractId: string | null;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ contractId }) => {
  if (!contractId) return null;

  const columns: ColumnsType<ContractHistory> = useMemo(
    () => [
      {
        title: 'Type de changement',
        dataIndex: 'changeType',
        render: (changeType: string) => (
          <Tag color={CHANGE_TYPE_COLORS[changeType] || 'blue'}>
            {CHANGE_TYPE_DESCRIPTIONS[changeType] || changeType}
          </Tag>
        ),
        sorter: (a, b) => a.changeType.localeCompare(b.changeType),
      },
      {
        title: 'Ancienne valeur',
        dataIndex: 'oldValue',
        render: (oldValue: string | null) => <Text>{oldValue ?? 'N/A'}</Text>,
      },
      {
        title: 'Nouvelle valeur',
        dataIndex: 'newValue',
        render: (newValue: string | null) => <Text>{newValue ?? 'N/A'}</Text>,
      },
      {
        title: 'Date de modification',
        dataIndex: 'createdAt',
        render: (date: string) => formatDate(date, 'DD/MM/YYYY'),
        sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      },
    ],
    [],
  );

  return (
    <TablePageLayout<ContractHistory>
      listEndpoint={`/contracts/${contractId}/history`}
      columns={columns}
      additionalQueryParams={{}}
      rowKey="id"
      showHeader={false}
    />
  );
};

export default HistoryTab;
