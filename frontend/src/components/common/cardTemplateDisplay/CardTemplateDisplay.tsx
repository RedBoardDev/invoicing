import type React from 'react';
import { Button, Typography, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type EmailTemplate from '@interfaces/emailTemplate';
import { EMAIL_VARIABLES_METADATA, type EmailVariable } from '@enums/emailVariables';
import styles from './CardTemplateDisplay.module.css';

const { Text, Title } = Typography;

interface CardTemplateDisplayProps {
  template: EmailTemplate;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
}

const CardTemplateDisplay: React.FC<CardTemplateDisplayProps> = ({
  template,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  const renderWithVariables = (text: string) => {
    const regex = /\{\{(\w+)\}\}/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while (true) {
      match = regex.exec(text);
      if (match === null) break;
      const variable = match[1] as EmailVariable;
      parts.push(text.slice(lastIndex, match.index));
      if (EMAIL_VARIABLES_METADATA[variable]) {
        parts.push(
          <span key={match.index} className={styles.variable}>
            {EMAIL_VARIABLES_METADATA[variable].label}
          </span>,
        );
      } else {
        parts.push(<span key={match.index} className={styles.unknownVariable}>{`{{${variable}}}`}</span>);
      }
      lastIndex = regex.lastIndex;
    }
    parts.push(text.slice(lastIndex));
    return parts;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <Title level={5} className={styles.name}>
            {template.name}
          </Title>
          <Text type="secondary" className={styles.createdAt}>
            Créé le {new Date(template.createdAt).toLocaleDateString('fr-FR')}
          </Text>
        </div>
        {showActions && (
          <Space className={styles.actions}>
            <Button type="default" icon={<EditOutlined />} onClick={onEdit} className={styles.actionButton} />
            <Button
              type="default"
              icon={<DeleteOutlined />}
              onClick={onDelete}
              className={styles.actionButton}
              danger
            />
          </Space>
        )}
      </div>
      <div className={styles.preview}>
        <Text strong className={styles.previewLabel}>
          Sujet :
        </Text>
        <div className={styles.previewText}>{renderWithVariables(template.subject)}</div>
        <Text strong className={styles.previewLabel}>
          Contenu :
        </Text>
        <div className={styles.previewContent}>{renderWithVariables(template.content)}</div>
      </div>
    </div>
  );
};

export default CardTemplateDisplay;
