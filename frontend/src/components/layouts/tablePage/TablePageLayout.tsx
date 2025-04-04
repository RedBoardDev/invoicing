// TablePageLayout.tsx
import React from 'react';
import styles from './TablePageLayout.module.css';
import { TablePageHeader } from './TablePageHeader';
import { useApiData } from '@hooks/useApiData';
import type { WithExtends } from '@api/types/extends';
import type { Result } from '@api/types/fetch';
import type { PaginatedApiResponse } from '@api/types/pagination';
import DataTable from 'components/common/dataTable/DataTable';

interface TablePageLayoutProps<T extends object, E extends string = never> {
  title?: string;
  listService: (
    extendsOptions?: E[],
    pagination?: { page?: number; pageSize?: number; totalCount?: boolean },
  ) => Promise<Result<PaginatedApiResponse<WithExtends<T, E>[], true>>>;
  extendsOptions?: E[];
  detailsRoutePath?: (id: string) => string;
  onAdd?: () => void;
  rowKey?: keyof T | ((record: WithExtends<T, E>) => string);
  extraButtons?: React.ReactNode[];
  showHeader?: boolean;
  columns: any; // Ajoutez les colonnes comme prop pour les passer à DataTable
}

export const TablePageLayout = <T extends object, E extends string = never>({
  title = '',
  listService,
  extendsOptions = [],
  detailsRoutePath,
  onAdd,
  rowKey = 'id' as keyof T,
  extraButtons = [],
  showHeader = true,
  columns,
}: TablePageLayoutProps<T, E>) => {
  const { data, loading, total, pagination, setPagination, refresh } = useApiData<T, E>({
    listService,
    extendsOptions,
  });

  return (
    <div className={styles.container}>
      {showHeader && (
        <TablePageHeader
          title={title}
          onAdd={onAdd}
          onRefresh={refresh}
          loading={loading}
          extraButtons={extraButtons}
        />
      )}
      <DataTable
        dataSource={data}
        loading={loading}
        total={total}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total,
          onChange: (page, pageSize) => setPagination({ page, pageSize }),
        }}
        columns={columns}
        detailsRoutePath={detailsRoutePath}
        rowKey={rowKey}
      />
    </div>
  );
};

export default React.memo(TablePageLayout) as typeof TablePageLayout;
