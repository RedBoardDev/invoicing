import { FilePdfOutlined } from '@ant-design/icons';
import { ROUTE_PATHS } from '@config/routePaths';
import { STATUS_COLORS, type InvoiceStatus } from '@enums/invoiceStatus';
import type Invoice from '@interfaces/invoice';
import { formatDate } from '@utils';
import { Button, Space, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TablePageLayout from 'components/layouts/tablePage/TablePageLayout';
import type React from 'react';
import { useMemo } from 'react';
import type { WithExtends } from '@api/types/extends';
import { getContractInvoices } from '@api/services/contracts';

const { Text } = Typography;

interface InvoicesTabProps {
  contractId: string | null;
}

const InvoicesTab: React.FC<InvoicesTabProps> = ({ contractId }) => {
  if (!contractId) return null;

  // Typage corrigé pour inclure 'contract' et 'items'
  const columns: ColumnsType<WithExtends<Invoice, 'contract' | 'items'>> = useMemo(
    () => [
      {
        title: 'N° Facture',
        dataIndex: 'invoiceNumber',
        render: (number: string) => <Text strong>#{number}</Text>,
        sorter: (a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber),
      },
      {
        title: 'Contrat',
        dataIndex: 'contract',
        render: (contract) => <Text>{contract?.title ?? 'N/A'}</Text>,
        sorter: (a, b) => (a.contract?.title ?? '').localeCompare(b.contract?.title ?? ''),
      },
      {
        title: 'PDF / Envoyée',
        render: (_: unknown, record: WithExtends<Invoice, 'contract' | 'items'>) => (
          <Space>
            {record.fileId ? (
              <Button
                type="link"
                icon={<FilePdfOutlined />}
                onClick={() => window.open(record.fileId, '_blank', 'noopener,noreferrer')}>
                PDF
              </Button>
            ) : (
              'N/A'
            )}
            {record.sendDate ? formatDate(record.sendDate, 'DD/MM/YYYY') : ''}
          </Space>
        ),
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
        render: (date: string | Date) => formatDate(date, 'DD/MM/YYYY'),
        sorter: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      },
    ],
    [],
  );

  const listService = (
    extendsOptions?: ('contract' | 'items')[],
    pagination?: { page?: number; pageSize?: number; totalCount?: boolean },
  ) => getContractInvoices(contractId, extendsOptions, pagination);

  return (
    <TablePageLayout<WithExtends<Invoice, 'contract'>, 'contract' | 'items'>
      listService={listService}
      extendsOptions={['items', 'contract']}
      detailsRoutePath={(id) => ROUTE_PATHS.private.invoices.detail(id)}
      columns={columns}
      showHeader={false}
    />
  );
};

export default InvoicesTab;
