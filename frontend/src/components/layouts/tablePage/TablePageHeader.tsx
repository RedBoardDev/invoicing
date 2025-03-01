import { DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Divider, Space, Typography } from 'antd';
import React from 'react';
import styles from './TablePageLayout.module.css';

const { Title } = Typography;

interface TablePageHeaderProps {
  title: string;
  onAdd?: () => void;
  onRefresh: () => void;
  onDeleteClick: () => void;
  selectedKeysCount: number;
  loading?: boolean;
  extraButtons?: React.ReactNode[];
  hasDelete: boolean;
}

export const TablePageHeader = ({
  title,
  onAdd,
  onRefresh,
  onDeleteClick,
  selectedKeysCount,
  loading,
  extraButtons = [],
  hasDelete,
}: TablePageHeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Title level={1} className={styles.title}>
          {title}
        </Title>

        <Space size="small" align="center" className={styles.actionsContainer}>
          {extraButtons}

          <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading} aria-label="rafraîchir">
            Rafraîchir
          </Button>

          <Divider type="vertical" className={styles.buttonDivider} />

          {onAdd && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd} aria-label="créer">
              Créer
            </Button>
          )}

          {hasDelete && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={onDeleteClick}
              disabled={selectedKeysCount === 0}
              aria-label="supprimer">
              Supprimer ({selectedKeysCount})
            </Button>
          )}
        </Space>
      </div>
      <Divider className={styles.headerDivider} />
    </header>
  );
};

export default React.memo(TablePageHeader);
