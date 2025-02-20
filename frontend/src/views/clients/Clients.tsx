import type React from 'react';
import { useMemo, useState } from 'react';
import type Client from '@interfaces/client';
import type Contract from '@interfaces/contract';
import { formatDate } from '@utils';
import type { ColumnsType } from 'antd/lib/table';
import TablePageLayout from 'components/layouts/tablePage/TablePageLayout';
import AddClient from 'components/common/modal/create/AddClient';
import { ROUTE_PATHS } from '@config/routePaths';

const Clients: React.FC = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const columns: ColumnsType<Client> = useMemo(
    () => [
      {
        title: 'Nom',
        dataIndex: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Contrats',
        dataIndex: 'contracts',
        render: (contracts: Contract[]) => contracts.length,
        sorter: (a, b) => a.contracts.length - b.contracts.length,
      },
      {
        title: 'Créé le',
        dataIndex: 'createdAt',
        render: (date: string) => formatDate(date, 'DD/MM/YYYY'),
        sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      },
      {
        title: 'Modifié le',
        dataIndex: 'updatedAt',
        render: (date: string) => formatDate(date, 'DD/MM/YYYY'),
        sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      },
    ],
    [],
  );

  return (
    <>
      <TablePageLayout<Client>
        title="Clients"
        listEndpoint="/clients"
        detailsRoutePath={(id) => ROUTE_PATHS.private.clients.detail(id)}
        additionalQueryParams={{ includeContracts: true }}
        deleteEndpoint="/clients"
        onAdd={() => setAddModalVisible(true)}
        columns={columns}
      />
      <AddClient visible={addModalVisible} setVisible={setAddModalVisible} />
    </>
  );
};

export default Clients;
