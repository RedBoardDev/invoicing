import type React from 'react';
import { useCallback } from 'react';
import { Space, Typography } from 'antd';
import type EmailTemplate from '@interfaces/emailTemplate';
import EmailTemplateSelect from 'components/dataEntry/EmailTemplateSelect';
import CardTemplateDisplay from 'components/common/cardTemplateDisplay/CardTemplateDisplay';
import { useMessage } from '@hooks/useMessage';
import { updateContract } from '@api/services/contracts';
import type { WithExtends } from '@api/types/extends';
import type Contract from '@interfaces/contract';
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
  const messageApi = useMessage();

  const handleTemplateChange = useCallback(
    async (newTemplateId: string) => {
      if (!contractId || newTemplateId === emailTemplate?.id) return;

      try {
        const result = await updateContract(contractId, { emailTemplateId: newTemplateId });
        if (!result.success) throw new Error(result.error || 'Failed to update email template');

        const updatedContract = result.data.data as WithExtends<Contract, 'emailTemplate'>;
        messageApi.success('Template mis à jour avec succès');
        onUpdate?.(updatedContract.emailTemplate, refresh);
        refresh();
      } catch (error) {
        messageApi.error('Erreur lors de la mise à jour du template');
      }
    },
    [contractId, emailTemplate?.id, onUpdate, refresh, messageApi],
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
