import { useMessage } from '@contexts/MessageContext';
import { useApiData } from '@hooks/useApiData';
import { Spin, Table, type TableProps } from 'antd';
import { ConfirmationModal } from 'components/common/modal/ConfirmationModal';
import React, { useMemo, useState } from 'react';
import { TablePageHeader } from './TablePageHeader';
import styles from './TablePageLayout.module.css';
import { useNavigate } from 'react-router-dom';

interface TablePageLayoutProps<T extends object> extends Omit<TableProps<T>, 'title' | 'dataSource'> {
  title?: string;
  listEndpoint: string;
  extendsOptions?: string[];
  deleteEndpoint?: string;
  detailsRoutePath?: (id: string) => string;
  onAdd?: () => void;
  rowKey?: string;
  extraButtons?: React.ReactNode[];
  showHeader?: boolean;
}

export const TablePageLayout = <T extends object>({
  title = '',
  listEndpoint,
  extendsOptions = [],
  deleteEndpoint,
  detailsRoutePath,
  onAdd,
  rowKey = 'id',
  extraButtons = [],
  showHeader = true,
  ...tableProps
}: TablePageLayoutProps<T>) => {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const messageApi = useMessage();

  const { data, loading, total, pagination, setPagination, refresh } = useApiData<T>({
    endpoint: listEndpoint,
    extendsOptions,
  });

  const handleDelete = async () => {
    if (!deleteEndpoint) return;

    setDeleteLoading(true);

    try {
      const response = await fetch(`http://localhost:3000${deleteEndpoint}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedKeys }),
      });

      const data = await response.json();

      if (data.failedIds?.length > 0) {
        messageApi?.error(`Échec de la suppression de ${data.failedIds.length} élément(s) sur ${selectedKeys.length}.`);
      } else {
        messageApi?.success('Tous les éléments ont été supprimés avec succès.');
      }

      await refresh();
      setSelectedKeys([]);
    } catch (error) {
      console.error('Delete failed:', error);
      messageApi?.error('Erreur lors de la suppression');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmVisible(false);
    }
  };

  const rowSelection = useMemo(
    () =>
      deleteEndpoint
        ? {
            selectedRowKeys: selectedKeys,
            onChange: setSelectedKeys,
          }
        : undefined,
    [deleteEndpoint, selectedKeys],
  );

  return (
    <div className={styles.container}>
      {showHeader && (
        <>
          <ConfirmationModal
            visible={deleteConfirmVisible}
            title={`Supprimer ${selectedKeys.length} éléments`}
            content="Êtes-vous sûr de vouloir supprimer ces éléments ? Cette action est irréversible."
            loading={deleteLoading}
            onConfirm={handleDelete}
            onCancel={() => setDeleteConfirmVisible(false)}
          />

          <TablePageHeader
            title={title}
            onAdd={onAdd}
            onRefresh={refresh}
            onDeleteClick={() => setDeleteConfirmVisible(true)}
            selectedKeysCount={selectedKeys.length}
            loading={loading}
            extraButtons={extraButtons}
            hasDelete={!!deleteEndpoint}
          />
        </>
      )}

      <Spin spinning={loading} tip="Chargement...">
        <Table<T>
          {...tableProps}
          dataSource={data}
          rowKey={rowKey}
          rowSelection={rowSelection}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total,
            showSizeChanger: true,
            onChange: (page, pageSize) => setPagination({ page, pageSize }),
          }}
          className={styles.table}
          scroll={{ y: 'calc(100vh - 200px)' }}
          size="middle"
          bordered={false}
          onRow={(record: T) => ({
            onClick: () => detailsRoutePath && navigate(detailsRoutePath((record as any)[rowKey])),
          })}
        />
      </Spin>
    </div>
  );
};

export default React.memo(TablePageLayout) as typeof TablePageLayout;
