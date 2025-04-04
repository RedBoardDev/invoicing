import { useMessage } from '@hooks/useMessage';
import { Form, Modal, Button } from 'antd';
import type { FormInstance } from 'antd/lib';
import type React from 'react';
import { useState } from 'react';
import styles from './AddModal.module.css';
import type { Result, ApiResponse } from '@api/types/fetch';

interface AddModalProps<T extends object> {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  title: string;
  initialValues?: Partial<T>;
  form?: FormInstance<T>;
  createService: (data: T) => Promise<Result<ApiResponse<T>>>;
  children: (form: FormInstance<T>) => React.ReactNode;
}

export const AddModal = <T extends object>({
  visible,
  onCancel,
  onSuccess,
  title,
  initialValues,
  form,
  createService,
  children,
}: AddModalProps<T>) => {
  const [formInstance] = Form.useForm<T>();
  const effectiveForm = form || formInstance;
  const [loading, setLoading] = useState(false);
  const messageApi = useMessage();

  const handleSubmit = async (values: T) => {
    setLoading(true);
    try {
      const result = await createService(values);
      if (!result.success) throw new Error(result.error || 'Erreur lors de la création');

      messageApi.success('Création réussie');
      effectiveForm.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Creation failed:', error);
      messageApi.error(error instanceof Error ? error.message : 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    effectiveForm.resetFields();
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
      <Form form={effectiveForm} layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
        {children(effectiveForm)}
        {modalFooter}
      </Form>
    </Modal>
  );
};
