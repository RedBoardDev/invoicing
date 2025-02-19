import type React from 'react';
import { Button, Skeleton, Flex, Typography } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './HeaderDetailsLayout.module.css';
import { Icon } from '@components/common';
import type { IconName } from '@icons/index';

const { Text } = Typography;

interface DataFieldConfig<T> {
  key: keyof T;
  children: (data: T) => React.ReactNode;
  editConfig?: {
    input: React.ReactElement;
    rules?: any[];
  };
}

interface HeaderDetailsLayoutProps<T> {
  title: string;
  icon: IconName;
  data: T | null;
  dataConfig: DataFieldConfig<T>[];
  onBack: () => void | Promise<void>;
  onEdit: () => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}

const HeaderDetailsLayout = <T extends object>({
  title,
  icon: iconName,
  data,
  dataConfig,
  onBack,
  onEdit,
  onDelete,
}: HeaderDetailsLayoutProps<T>) => {
  const isLoading = !data;

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <Flex gap={8} align="center">
          <Flex vertical gap={8} className={styles.buttons}>
            <Button
              icon={<DeleteOutlined />}
              onClick={onDelete}
              disabled={isLoading}
              className={styles.button}
              danger
            />
            <Button icon={<EditOutlined />} onClick={onEdit} disabled={isLoading} className={styles.button} />
            <Button icon={<ArrowLeftOutlined />} onClick={onBack} className={styles.button} />
          </Flex>

          <Flex vertical gap={8} align="center">
            <Icon name={iconName} className={styles.icon} />
            <Text strong className={styles.title}>
              {title}
            </Text>
          </Flex>
        </Flex>
      </div>
      <div className={styles.details}>
        {dataConfig.map((field, index) => (
          <div key={index} className={styles.detailItem}>
            <div className={styles.value}>
              {isLoading ? <Skeleton.Input active size="small" style={{ width: 220 }} /> : field.children(data as T)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderDetailsLayout;
