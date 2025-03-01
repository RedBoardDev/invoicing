import { useMessage } from '@contexts/MessageContext';
import { Spin, Table, type TableProps } from 'antd';
import { ConfirmationModal } from 'components/common/modal/ConfirmationModal';
import React, { useMemo, useState } from 'react';
import { TablePageHeader } from './TablePageHeader';
import styles from './TablePageLayout.module.css';
import { useNavigate } from 'react-router-dom';
import { useApiData } from '@hooks/useApiData';
import type { WithExtends } from '@api/types/extends';
import type { Result, ApiResponse } from '@api/types/fetch';
import type { PaginatedApiResponse } from '@api/types/pagination';

interface TablePageLayoutProps<T extends object, E extends string = never>
  extends Omit<TableProps<WithExtends<T, E>>, 'title' | 'dataSource'> {
  title?: string;
  listService: (
    extendsOptions?: E[],
    pagination?: { page?: number; pageSize?: number; totalCount?: boolean },
  ) => Promise<Result<PaginatedApiResponse<WithExtends<T, E>[], true>>>;
  deleteService?: (
    ids: string[],
  ) => Promise<Result<ApiResponse<{ deletedIds: string[]; failedIds: { id: string; reason: string }[] }>>>;
  extendsOptions?: E[];
  detailsRoutePath?: (id: string) => string;
  onAdd?: () => void;
  rowKey?: keyof T | ((record: WithExtends<T, E>) => string);
  extraButtons?: React.ReactNode[];
  showHeader?: boolean;
}

export const TablePageLayout = <T extends object, E extends string = never>({
  title = '',
  listService,
  deleteService,
  extendsOptions = [],
  detailsRoutePath,
  onAdd,
  rowKey = 'id' as keyof T,
  extraButtons = [],
  showHeader = true,
  ...tableProps
}: TablePageLayoutProps<T, E>) => {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const messageApi = useMessage();

  const { data, loading, total, pagination, setPagination, refresh } = useApiData<T, E>({
    listService,
    extendsOptions,
  });

  const handleDelete = async () => {
    if (!deleteService) return;

    setDeleteLoading(true);

    try {
      const result = await deleteService(selectedKeys as string[]);
      if (!result.success) throw new Error(result.error || 'Erreur lors de la suppression');

      const { failedIds } = result.data.data;
      if (failedIds?.length > 0) {
        messageApi?.error(`Échec de la suppression de ${failedIds.length} élément(s) sur ${selectedKeys.length}.`);
      } else {
        messageApi?.success('Tous les éléments ont été supprimés avec succès.');
      }

      await refresh();
      setSelectedKeys([]);
    } catch (error) {
      console.error('Delete failed:', error);
      messageApi?.error(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmVisible(false);
    }
  };

  const rowSelection = useMemo(
    () =>
      deleteService
        ? {
            selectedRowKeys: selectedKeys,
            onChange: setSelectedKeys,
          }
        : undefined,
    [deleteService, selectedKeys],
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
            hasDelete={!!deleteService}
          />
        </>
      )}

      <Spin spinning={loading} tip="Chargement...">
        <Table<WithExtends<T, E>>
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
          onRow={(record) => ({
            onClick: () => detailsRoutePath && navigate(detailsRoutePath((record as any)[rowKey as string])),
          })}
        />
      </Spin>
    </div>
  );
};

export default React.memo(TablePageLayout) as typeof TablePageLayout;
