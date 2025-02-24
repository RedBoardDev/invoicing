import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type InvoiceItem from '@interfaces/invoiceItem';
import { formatDate } from '@utils';
import type React from 'react';
import { useMemo } from 'react';

const { Text } = Typography;

interface ItemsTabProps {
  items: InvoiceItem[] | undefined;
}

const ItemsTab: React.FC<ItemsTabProps> = ({ items }) => {
  const columns: ColumnsType<InvoiceItem> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        render: (id: number) => <Text>{id}</Text>,
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        render: (description: string) => <Text>{description}</Text>,
        sorter: (a, b) => a.description.localeCompare(b.description),
      },
      {
        title: 'Montant',
        dataIndex: 'amount',
        render: (amount: number) => (
          <Text type="secondary">{amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</Text>
        ),
        sorter: (a, b) => a.amount - b.amount,
      },
      {
        title: 'Créé le',
        dataIndex: 'createdAt',
        render: (date: string) => formatDate(date, 'DD/MM/YYYY HH:mm'),
        sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      },
      {
        title: 'Mis à jour le',
        dataIndex: 'updatedAt',
        render: (date: string) => formatDate(date, 'DD/MM/YYYY HH:mm'),
        sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      },
    ],
    [],
  );

  return (
    <Table
      columns={columns}
      dataSource={items}
      rowKey="id"
      pagination={false}
      size="small"
    />
  );
};

export default ItemsTab;
