import { FilePdfOutlined } from '@ant-design/icons';
import { ROUTE_PATHS } from '@config/routePaths';
import { type InvoiceStatus, STATUS_COLORS } from '@enums/invoiceStatus';
import type Invoice from '@interfaces/invoice';
import { formatDate } from '@utils';
import { Tag, Typography, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AddInvoice from 'components/common/modal/create/invoice/AddInvoice';
import TablePageLayout from 'components/layouts/tablePage/TablePageLayout';
import type React from 'react';
import { useMemo, useState } from 'react';

const { Text } = Typography;

const Invoices: React.FC = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const columns: ColumnsType<Invoice> = useMemo(
    () => [
      {
        title: 'N° Facture',
        dataIndex: 'invoiceNumber',
        render: (number: string) => <Text strong>#{number}</Text>,
        sorter: (a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber),
      },
      {
        title: 'Contrat',
        dataIndex: ['contract', 'title'],
        render: (title: string) => <Text>{title}</Text>,
        sorter: (a, b) => a.contract?.title.localeCompare(b.contract?.title || '') || 0,
      },
      {
        title: 'PDF / Envoyée',
        render: (_: unknown, record: Invoice) => (
          <Space>
            {record.pdfUrl ? (
              <Button
                type="link"
                icon={<FilePdfOutlined />}
                onClick={() => window.open(record.pdfUrl, '_blank', 'noopener,noreferrer')}>
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
        render: (date: string) => formatDate(date, 'DD/MM/YYYY'),
        sorter: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      },
    ],
    [],
  );

  return (
    <>
      <TablePageLayout<Invoice>
        title="Factures"
        listEndpoint="/invoices"
        detailsRoutePath={(id) => ROUTE_PATHS.private.invoices.detail(id)}
        deleteEndpoint="/invoices"
        onAdd={() => setAddModalVisible(true)}
        columns={columns}
        additionalQueryParams={{ includeContract: true }}
      />
      <AddInvoice visible={addModalVisible} setVisible={setAddModalVisible} />
    </>
  );
};

export default Invoices;
