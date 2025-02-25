import type React from 'react';
import { useRef } from 'react';
import { Form, Input, Button } from 'antd';
import type { FormInstance, InputRef } from 'antd';
import VariablePicker from 'components/common/variablePicker/VariablePicker';
import type { EmailTemplate } from './types';
import styles from './styles.module.css';
import type { EmailVariable } from '@enums/emailVariables';

interface EmailTemplateFormProps {
  form: FormInstance;
  template: EmailTemplate | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<EmailTemplate>) => void;
  onInsertVariable: (variable: EmailVariable) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, field: 'subject' | 'content') => void;
  onFieldFocus: (field: 'subject' | 'content') => void;
  onCursorUpdate: (field: 'subject' | 'content', pos: number) => void;
}

export const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({
  form,
  template,
  loading,
  onClose,
  onSubmit,
  onInsertVariable,
  onKeyDown,
  onFieldFocus,
  onCursorUpdate,
}) => {
  const subjectRef = useRef<InputRef>(null);
  const contentRef = useRef<InputRef>(null);

  return (
    <div className={styles.editor}>
      <Form form={form} layout="vertical" onFinish={onSubmit} className={styles.form}>
        <div className={styles.formContent}>
          <Form.Item name="name" label="Nom" rules={[{ required: true, message: '' }, { min: 1 }]}>
            <Input placeholder="Nom du template" />
          </Form.Item>
          <Form.Item name="subject" label="Sujet" rules={[{ required: true, message: '' }, { min: 1 }]}>
            <Input
              placeholder="Sujet de l'email"
              ref={subjectRef}
              onFocus={() => onFieldFocus('subject')}
              onClick={(e) => onCursorUpdate('subject', (e.target as HTMLInputElement).selectionStart || 0)}
              onSelect={(e) => onCursorUpdate('subject', (e.target as HTMLInputElement).selectionStart || 0)}
              onKeyDown={(e) => onKeyDown(e, 'subject')}
            />
          </Form.Item>
          <Form.Item
            name="content"
            label="Contenu"
            rules={[{ required: true, message: '' }, { min: 1 }]}
            className={styles.contentFormItem}>
            <Input.TextArea
              placeholder="Contenu de l'email"
              ref={contentRef}
              onFocus={() => onFieldFocus('content')}
              onClick={(e) => onCursorUpdate('content', (e.target as HTMLTextAreaElement).selectionStart || 0)}
              onSelect={(e) => onCursorUpdate('content', (e.target as HTMLTextAreaElement).selectionStart || 0)}
              onKeyDown={(e) => onKeyDown(e, 'content')}
              rows={11}
              style={{ resize: 'none' }}
            />
          </Form.Item>
        </div>
        <div className={styles.footer}>
          <VariablePicker onInsert={onInsertVariable} disabled={loading} />
          <div className={styles.footerButtons}>
            <Button onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {template ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default EmailTemplateForm;
