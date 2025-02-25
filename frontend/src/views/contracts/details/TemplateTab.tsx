import type React from 'react';
import { useCallback } from 'react';
import { Space, Typography, message } from 'antd';
import type EmailTemplate from '@interfaces/emailTemplate';
import EmailTemplateSelect from 'components/dataEntry/EmailTemplateSelect';
import CardTemplateDisplay from 'components/common/cardTemplateDisplay/CardTemplateDisplay';
import styles from './TemplateTab.module.css';

const { Text } = Typography;

interface TemplateTabProps {
  emailTemplate: EmailTemplate | null;
  contractId: string | null;
  isLoading: boolean;
  onUpdate?: (updatedTemplate: EmailTemplate, refresh: () => void) => void;
  refresh: () => void;
}

const TemplateTab: React.FC<TemplateTabProps> = ({ emailTemplate, contractId, isLoading, onUpdate, refresh }) => {
  const handleTemplateChange = useCallback(
    async (newTemplateId: string) => {
      if (!contractId || newTemplateId === emailTemplate?.id) return;

      try {
        const response = await fetch(`http://localhost:3000/contracts/${contractId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailTemplateId: newTemplateId }),
        });

        if (!response.ok) throw new Error('Failed to update email template');
        const updatedContract = await response.json();
        const updatedTemplate = updatedContract.emailTemplate;
        message.success('Template mis à jour avec succès');
        onUpdate?.(updatedTemplate, refresh);
        refresh();
      } catch (error) {
        message.error('Erreur lors de la mise à jour du template');
      }
    },
    [contractId, emailTemplate?.id, onUpdate, refresh],
  );

  return (
    <div className={styles.container}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space align="center" size="middle">
          <Text strong>Template actuel :</Text>
          {isLoading ? (
            <Text type="secondary">Chargement...</Text>
          ) : (
            <EmailTemplateSelect value={emailTemplate?.id} onChange={handleTemplateChange} />
          )}
        </Space>
        {isLoading ? (
          <Text type="secondary">Chargement des détails...</Text>
        ) : emailTemplate ? (
          <CardTemplateDisplay template={emailTemplate} showActions={false} />
        ) : (
          <Text type="secondary">Aucun template assigné au contrat</Text>
        )}
      </Space>
    </div>
  );
};

export default TemplateTab;
