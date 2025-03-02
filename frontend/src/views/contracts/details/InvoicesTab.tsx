import { ROUTE_PATHS } from '@config/routePaths';
import { InvoiceStatus, STATUS_COLORS, STATUS_LABELS } from '@enums/invoiceStatus';
import type Invoice from '@interfaces/invoice';
import { formatDate } from '@utils';
import { Space, Tag, Typography } from 'antd';
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

  const columns: ColumnsType<WithExtends<Invoice, 'contract' | 'items'>> = useMemo(
    () => [
      {
        title: 'N° Facture',
        dataIndex: 'invoiceNumber',
        render: (number: string, record: WithExtends<Invoice, 'contract'>) =>
          number ? (
            <Text strong>{`#${number}`}</Text>
          ) : (
            <Text>{record.status === InvoiceStatus.DRAFT ? 'Provisoire' : 'N/A'}</Text>
          ),
        sorter: (a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber),
      },
      {
        title: 'Contrat',
        dataIndex: 'contract',
        render: (contract) => <Text>{contract?.title || 'N/A'}</Text>,
        sorter: (a, b) => (a.contract?.title || '').localeCompare(b.contract?.title || ''),
      },
      {
        title: 'PDF / Envoyée',
        render: (_: unknown, record: WithExtends<Invoice, 'contract'>) => (
          <Space>{record.sendDate ? formatDate(record.sendDate, 'DD/MM/YYYY') : 'N/A'}</Space>
        ),
      },
      {
        title: 'Statut',
        dataIndex: 'status',
        render: (status: InvoiceStatus) => <Tag color={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Tag>,
        sorter: (a, b) => a.status.localeCompare(b.status),
      },
      {
        title: 'Échéance',
        dataIndex: 'dueDate',
        render: (date: string) => (date ? formatDate(date, 'DD/MM/YYYY') : 'N/A'),
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
