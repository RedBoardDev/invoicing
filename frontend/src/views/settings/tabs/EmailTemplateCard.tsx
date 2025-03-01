import type React from 'react';
import { Button, Typography, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type EmailTemplate from '@interfaces/emailTemplate';
import { useMessage } from '@hooks/useMessage';
import { EMAIL_VARIABLES_METADATA, type EmailVariable } from '@enums/emailVariables';
import { deleteEmailTemplates } from '@api/services/emailTemplates';
import styles from './EmailTemplateCard.module.css';

const { Text, Title } = Typography;

interface EmailTemplateCardProps {
  template: EmailTemplate;
  onEdit: () => void;
  onDelete: () => void;
}

const EmailTemplateCard: React.FC<EmailTemplateCardProps> = ({ template, onEdit, onDelete }) => {
  const messageApi = useMessage();

  const handleDelete = async () => {
    try {
      const result = await deleteEmailTemplates([template.id]);
      if (!result.success) throw new Error(result.error || 'Failed to delete template');
      messageApi?.success('Template supprimé avec succès');
      onDelete();
    } catch (error) {
      messageApi?.error('Erreur lors de la suppression');
    }
  };

  const renderWithVariables = (text: string) => {
    const regex = /\{\{(\w+)\}\}/g;
    const parts = [];
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
        parts.push(<span className={styles.unknownVariable}>{`{{${variable}}}`}</span>);
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
        <Space className={styles.actions}>
          <Button type="default" icon={<EditOutlined />} onClick={onEdit} className={styles.actionButton} />
          <Button
            type="default"
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            className={styles.actionButton}
            danger
          />
        </Space>
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

export default EmailTemplateCard;
