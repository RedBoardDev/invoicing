import type React from 'react';
import { memo, useCallback, useMemo } from 'react';
import { Spin, Table, type TableProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './DataTable.module.css';

export interface DataTableProps<T extends object> extends Omit<TableProps<T>, 'dataSource' | 'loading'> {
  dataSource: T[];
  loading?: boolean;
  total?: number;
  error?: Error | string | null;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    onChange: (page: number, pageSize: number) => void;
  };
  detailsRoutePath?: (id: string) => string;
  rowKey?: keyof T | ((record: T) => string);
  emptyText?: React.ReactNode;
}

const DataTable = <T extends object>({
  dataSource,
  loading = false,
  total,
  error,
  pagination,
  detailsRoutePath,
  rowKey = 'id' as keyof T,
  emptyText = 'Aucune donnée disponible',
  ...tableProps
}: DataTableProps<T>) => {
  const navigate = useNavigate();

  const handleRowClick = useCallback(
    (record: T) => ({
      onClick: () => {
        if (detailsRoutePath) {
          const key = typeof rowKey === 'function' ? rowKey(record) : (record[rowKey] as string);
          navigate(detailsRoutePath(key));
        }
      },
    }),
    [detailsRoutePath, navigate, rowKey],
  );

  const paginationConfig = useMemo(
    () =>
      pagination
        ? {
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
            showSizeChanger: pagination.showSizeChanger ?? true,
            onChange: pagination.onChange,
            showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} sur ${total} éléments`,
          }
        : false,
    [pagination, total],
  );

  const renderContent = () => {
    if (error) {
      return (
        <div className={styles.errorContainer}>
          <span>{error instanceof Error ? error.message : error}</span>
        </div>
      );
    }

    return (
      <Table<T>
        dataSource={dataSource}
        rowKey={rowKey}
        pagination={paginationConfig}
        className={styles.table}
        size="middle"
        bordered={false}
        locale={{ emptyText }}
        onRow={detailsRoutePath ? handleRowClick : undefined}
        {...tableProps}
      />
    );
  };

  return (
    <div className={styles.container}>
      <Spin spinning={loading} tip="Chargement...">
        {renderContent()}
      </Spin>
    </div>
  );
};

export default memo(DataTable) as typeof DataTable;
