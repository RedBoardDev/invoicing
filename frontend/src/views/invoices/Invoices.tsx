import { FilePdfOutlined } from '@ant-design/icons';
import { ROUTE_PATHS } from '@config/routePaths';
import { type InvoiceStatus, STATUS_COLORS, STATUS_LABELS } from '@enums/invoiceStatus';
import type Invoice from '@interfaces/invoice';
import { formatDate } from '@utils';
import { Tag, Typography, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AddInvoice from 'components/common/modal/create/invoice/AddInvoice';
import TablePageLayout from 'components/layouts/tablePage/TablePageLayout';
import type React from 'react';
import { useMemo, useState } from 'react';
import type { WithExtends } from '@api/types/extends';
import { getInvoices, deleteInvoices } from '@api/services/invoices';

const { Text } = Typography;

const Invoices: React.FC = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const columns: ColumnsType<WithExtends<Invoice, 'contract'>> = useMemo(
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
        render: (contract) => <Text>{contract?.title || 'N/A'}</Text>,
        sorter: (a, b) => (a.contract?.title || '').localeCompare(b.contract?.title || ''),
      },
      {
        title: 'PDF / Envoyée',
        render: (_: unknown, record: WithExtends<Invoice, 'contract'>) => (
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
        render: (status: InvoiceStatus) => <Tag color={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Tag>,
        sorter: (a, b) => a.status.localeCompare(b.status),
      },
      {
        title: 'Échéance',
        dataIndex: 'dueDate',
        render: (date: string) => formatDate(date, 'DD/MM/YYYY'),
        sorter: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      },
    ],
    [],
  );

  return (
    <>
      <TablePageLayout<WithExtends<Invoice, 'contract'>, 'contract'>
        title="Factures"
        listService={getInvoices}
        deleteService={deleteInvoices}
        detailsRoutePath={(id) => ROUTE_PATHS.private.invoices.detail(id)}
        onAdd={() => setAddModalVisible(true)}
        columns={columns}
        extendsOptions={['contract']}
      />
      <AddInvoice visible={addModalVisible} setVisible={setAddModalVisible} />
    </>
  );
};

export default Invoices;
