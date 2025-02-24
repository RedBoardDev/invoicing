import { useMessage } from '@hooks/useMessage';
import { Form, Modal, Button } from 'antd';
import type { FormInstance } from 'antd/lib';
import type React from 'react';
import { useState } from 'react';
import styles from './AddModal.module.css';

interface AddModalProps<T = unknown> {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  endpoint: string;
  title: string;
  initialValues?: Partial<T>;
  form?: FormInstance<T>;
  children: (form: FormInstance<T>) => React.ReactNode;
}

export const AddModal = <T extends object>({
  visible,
  onCancel,
  onSuccess,
  endpoint,
  title,
  initialValues,
  form,
  children,
}: AddModalProps<T>) => {
  const [formInstance] = Form.useForm<T>();
  form = form || formInstance;
  const [loading, setLoading] = useState(false);
  const messageApi = useMessage();

  const handleSubmit = async (values: T) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error(response.statusText);

      messageApi.success('Création réussie');
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Creation failed:', error);
      messageApi.error('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const modalFooter = (
    <div className={styles.footer}>
      <Button onClick={handleCancel} disabled={loading}>
        Annuler
      </Button>
      <Button type="primary" htmlType="submit" loading={loading}>
        OK
      </Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={handleCancel} footer={null}>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
        onValuesChange={(changed, all) => console.log('Changed:', changed, 'All:', all)}>
        {children(form)}
        {modalFooter}
      </Form>
    </Modal>
  );
};
