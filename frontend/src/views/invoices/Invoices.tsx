import { ROUTE_PATHS } from '@config/routePaths';
import type Invoice from '@interfaces/invoice';
import { formatDate } from '@utils';
import type { ColumnsType } from 'antd/es/table';
import AddInvoice from 'components/common/modal/create/AddInvoice';
import TablePageLayout from 'components/layouts/tablePage/TablePageLayout';
import type React from 'react';
import { useMemo, useState } from 'react';

const Invoices: React.FC = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const columns: ColumnsType<Invoice> = useMemo(
    () => [
      {
        title: 'Créé le',
        dataIndex: 'createdAt',
        render: (date: string) => formatDate(date, 'DD/MM/YYYY'),
        sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
