import type React from 'react';
import { useState } from 'react';
import { Button, Empty, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import EmailTemplateCard from './EmailTemplateCard';
import { useApiData } from '@hooks/useApiData';
import type EmailTemplate from '@interfaces/emailTemplate';
import styles from './EmailTemplatesTab.module.css';
import EmailTemplateModal from 'components/common/emailTemplateEditor/EmailTemplateModal';
import { getEmailTemplates } from '@api/services/emailTemplates';

const { Title } = Typography;

const EmailTemplatesTab: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const {
    data: templates,
    loading,
    refresh,
  } = useApiData<EmailTemplate>({
    listService: getEmailTemplates,
  });

  const handleCreate = () => {
    setEditingTemplate(null);
    setModalVisible(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setModalVisible(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={3} className={styles.title}>
          Templates email
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className={styles.addButton}>
          Nouveau Template
        </Button>
      </div>
      <div className={styles.templatesList}>
        {loading ? (
          <div className={styles.loading}>Chargement...</div>
        ) : templates.length === 0 ? (
          <Empty description="Aucun template d’email trouvé" imageStyle={{ height: 60 }} />
        ) : (
          templates.map((template) => (
            <EmailTemplateCard
              key={template.id}
              template={template}
              onEdit={() => handleEdit(template)}
              onDelete={refresh}
            />
          ))
        )}
      </div>
      <EmailTemplateModal
        visible={modalVisible}
        template={editingTemplate}
        onClose={() => setModalVisible(false)}
        onSuccess={refresh}
      />
    </div>
  );
};

export default EmailTemplatesTab;
