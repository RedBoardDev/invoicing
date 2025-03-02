import { ROUTE_PATHS } from '@config/routePaths';
import { type InvoiceStatus, STATUS_COLORS, STATUS_LABELS } from '@enums/invoiceStatus';
import type Invoice from '@interfaces/invoice';
import { formatDate } from '@utils';
import { Tag, Typography, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AddInvoice from 'components/common/modal/create/invoice/AddInvoice';
import TablePageLayout from 'components/layouts/tablePage/TablePageLayout';
import type React from 'react';
import { useMemo, useState } from 'react';
import type { WithExtends } from '@api/types/extends';
import { getInvoices } from '@api/services/invoices';

const { Text } = Typography;

const Invoices: React.FC = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const columns: ColumnsType<WithExtends<Invoice, 'contract'>> = useMemo(
    () => [
      {
        title: 'N° Facture',
        dataIndex: 'invoiceNumber',
        render: (number: string, record: WithExtends<Invoice, 'contract'>) => (
          number ? <Text strong>{`#${number}`}</Text> : <Text>{record.status === 'DRAFT' ? 'Provisoire' : 'N/A'}</Text>
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

  return (
    <>
      <TablePageLayout<WithExtends<Invoice, 'contract'>, 'contract'>
        key={refreshKey}
        title="Factures"
        listService={getInvoices}
        extendsOptions={['contract']}
        detailsRoutePath={(id) => ROUTE_PATHS.private.invoices.detail(id)}
        onAdd={() => setAddModalVisible(true)}
        columns={columns}
      />
      <AddInvoice visible={addModalVisible} setVisible={setAddModalVisible} onSuccess={handleRefresh} />
    </>
  );
};

export default Invoices;
