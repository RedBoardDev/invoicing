import { Button, Skeleton, Flex, Typography } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './HeaderDetailsLayout.module.css';
import { Icon } from '@components/common';
import EditManager from 'components/common/editManager';
import type { HeaderDetailsLayoutProps } from 'components/layouts/headerDetails/types';
import type { EditManagerConfig } from 'components/common/editManager/types';
import type React from 'react';
import type { Permissions } from '@api/types/extends';

const { Text } = Typography;

interface ExtendedHeaderDetailsProps<T> extends HeaderDetailsLayoutProps<T> {
  permissions?: Permissions;
}

const HeaderDetailsLayout = <T extends object>({
  title,
  icon: iconName,
  data,
  id,
  fields,
  updateService,
  extraButtons,
  onBack,
  onDelete,
  onEdit,
  permissions,
}: ExtendedHeaderDetailsProps<T>) => {
  const isLoading = !data;

  const configs = fields
    .filter((field) => field.editConfig)
    .map((field) => ({
      key: field.key,
      label: field.label,
      ...field.editConfig,
    })) as EditManagerConfig<T>[];

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <Flex gap={8} align="center">
          <Flex vertical gap={8} className={styles.buttons}>
            <Button
              icon={<DeleteOutlined />}
              onClick={onDelete}
              disabled={isLoading || (permissions && !permissions.canBeDeleted)}
              danger
            />
            <EditManager<T>
              data={data}
              id={id}
              disabled={isLoading}
              configs={configs}
              updateService={updateService}
              onSuccess={onEdit}
            />
            <Button icon={<ArrowLeftOutlined />} onClick={onBack} />
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
        {fields.map((field) => (
          <div key={field.key as string} className={styles.detailItem}>
            <div className={styles.value}>
              {isLoading ? <Skeleton.Input active size="small" style={{ width: 220 }} /> : field.render(data as T)}
            </div>
          </div>
        ))}
      </div>
      {extraButtons && (
        <div>
          {extraButtons && (
            <div className={styles.extraButtonsContainer}>
              <Flex gap="small" align="center">
                {extraButtons.map((button, index) => (
                  <div key={(button as React.ReactElement)?.key || index}>{button}</div>
                ))}
              </Flex>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderDetailsLayout;
