import { FilePdfOutlined } from '@ant-design/icons';
import { STATUS_COLORS, type InvoiceStatus } from '@enums/invoiceStatus';
import type { ContractHistory } from '@interfaces/contractHistory';
import { formatDate } from '@utils';
import { Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TablePageLayout from 'components/layouts/tablePage/TablePageLayout';
import type React from 'react';
import { useMemo } from 'react';

const { Text } = Typography;

interface HistoryTabProps {
  contractId: string | null;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ contractId }) => {
  if (!contractId) return;

  const columns: ColumnsType<ContractHistory> = useMemo(
    () => [
      {
        title: 'N° Facture',
        dataIndex: 'invoiceNumber',
        render: (number: string) => <Text strong>#{number}</Text>,
        sorter: (a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber),
      },
      {
        title: 'Montant Total',
        dataIndex: 'totalAmount',
        render: (amount: number) => (
          <Text type="secondary">{amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</Text>
        ),
        sorter: (a, b) => a.totalAmount - b.totalAmount,
      },
      {
        title: 'Statut',
        dataIndex: 'status',
        render: (status: InvoiceStatus) => <Tag color={STATUS_COLORS[status]}>{status.toUpperCase()}</Tag>,
        sorter: (a, b) => a.status.localeCompare(b.status),
      },
      {
        title: 'Échéance',
        dataIndex: 'dueDate',
        render: (date: Date) => formatDate(date, 'DD/MM/YYYY'),
        sorter: (a, b) => a.dueDate.getTime() - b.dueDate.getTime(),
      },
      {
        title: 'Envoyée le',
        dataIndex: 'sendDate',
        render: (date?: Date) => (date ? formatDate(date, 'DD/MM/YYYY') : 'N/A'),
        sorter: (a, b) => (a.sendDate?.getTime() || 0) - (b.sendDate?.getTime() || 0),
      },
      {
        title: 'PDF',
        dataIndex: 'pdfUrl',
        render: (url?: string) =>
          url ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
              <FilePdfOutlined />
            </a>
          ) : (
            'N/A'
          ),
      },
      {
        title: 'Créé le',
        dataIndex: 'createdAt',
        render: (date: Date) => formatDate(date, 'DD/MM/YYYY'),
        sorter: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      },
    ],
    [],
  );

  return (
    <TablePageLayout<ContractHistory> // TODO: plutot séparer la logique call + tableau dans un autre composant comme ça on peut utiliser soit le tableau uniquement soit ce layout qui utilisera le composant tableau
      listEndpoint={`/contracts/${contractId}/history`}
      columns={columns}
      additionalQueryParams={{}}
      showHeader={false}
    />
  );
};

export default HistoryTab;
