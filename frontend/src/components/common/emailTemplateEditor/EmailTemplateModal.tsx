import type React from 'react';
import { useEffect, useRef } from 'react';
import { Modal, Form, type InputRef } from 'antd';
import { EmailTemplateForm } from './EmailTemplateForm';
import { EmailTemplatePreview } from './EmailTemplatePreview';
import { useEmailTemplateLogic } from './useEmailTemplateLogic';
import type { EmailTemplateModalProps } from './types';
import styles from './styles.module.css';

const EmailTemplateModal: React.FC<EmailTemplateModalProps> = ({ visible, template, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const subjectRef = useRef<InputRef>(null);
  const contentRef = useRef<InputRef>(null);

  const { loading, setActiveField, insertVariable, handleKeyDown, handleSubmit, updateCursorPosition } =
    useEmailTemplateLogic(form, template, onSuccess, onClose, { subjectRef, contentRef });

  useEffect(() => {
    if (!visible) return;
    form.resetFields();
    if (template) form.setFieldsValue(template);
  }, [visible, template, form]);

  const handleClose = () => {
    form.resetFields();
    console.log('Après resetFields (fermeture) :', form.getFieldsValue());
    onClose();
  };

  const subject = Form.useWatch('subject', form) || '';
  const content = Form.useWatch('content', form) || '';

  return (
    <Modal
      title={template ? 'Modifier le Template' : 'Nouveau Template'}
      open={visible}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      width={900}
      bodyStyle={{ height: '65vh' }}>
      <div className={styles.container}>
        <EmailTemplateForm
          form={form}
          template={template}
          loading={loading}
          onClose={handleClose}
          onSubmit={handleSubmit}
          onInsertVariable={insertVariable}
          onKeyDown={handleKeyDown}
          onFieldFocus={setActiveField}
          onCursorUpdate={updateCursorPosition}
        />
        <EmailTemplatePreview subject={subject} content={content} />
      </div>
    </Modal>
  );
};

export default EmailTemplateModal;
