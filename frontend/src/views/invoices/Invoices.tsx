import { FilePdfOutlined } from '@ant-design/icons';
import { ROUTE_PATHS } from '@config/routePaths';
import { type InvoiceStatus, STATUS_COLORS } from '@enums/invoiceStatus';
import type Invoice from '@interfaces/invoice';
import { formatDate } from '@utils';
import { Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AddInvoice from 'components/common/modal/create/AddInvoice';
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
    <>
      <TablePageLayout<Invoice>
        title="Factures"
        listEndpoint="/invoices"
        detailsRoutePath={(id) => ROUTE_PATHS.private.invoices.detail(id)}
        deleteEndpoint="/invoices"
        onAdd={() => setAddModalVisible(true)}
        columns={columns}
        additionalQueryParams={{ includeClient: true }}
      />

      <AddInvoice visible={addModalVisible} setVisible={setAddModalVisible} />
    </>
  );
};

export default Invoices;
