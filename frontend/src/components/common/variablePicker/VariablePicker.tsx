import type React from 'react';
import { Dropdown, Button, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { EMAIL_VARIABLES_METADATA, type EmailVariable } from '@enums/emailVariables';
import styles from './VariablePicker.module.css';

const { Text } = Typography;

interface VariablePickerProps {
  onInsert: (variable: EmailVariable) => void;
  disabled?: boolean;
}

const VariablePicker: React.FC<VariablePickerProps> = ({ onInsert, disabled }) => {
  const items: MenuProps['items'] = Object.entries(EMAIL_VARIABLES_METADATA).map(([key, meta]) => ({
    key,
    label: (
      <div className={styles.menuItem}>
        <Text strong>{meta.label}</Text>
        <Text type="secondary" className={styles.description}>
          {meta.description} (ex: {meta.example})
        </Text>
      </div>
    ),
    onClick: () => onInsert(key as EmailVariable),
  }));

  return (
    <Dropdown menu={{ items }} trigger={['click']} disabled={disabled}>
      <Button className={styles.button} disabled={disabled}>
        <Space>
          Insérer une variable
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
};

export default VariablePicker;
