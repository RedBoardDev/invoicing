import { useState, useCallback } from 'react';
import { Form } from 'antd';
import { useMessage } from '@hooks/useMessage';

type UseEditProps<T> = {
  data?: T | null;
  editEndpoint: string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};

export default function useEdit<T extends object>({ data, editEndpoint, onSuccess, onError }: UseEditProps<T>) {
  const [form] = Form.useForm<Partial<T>>();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messageApi = useMessage();

  const handleOpen = useCallback(() => {
    if (data) {
      form.setFieldsValue(data);
      setIsEditing(true);
    }
  }, [data, form]);

  const handleClose = useCallback(() => {
    setIsEditing(false);
    form.resetFields();
  }, [form]);

  const handleSubmit = useCallback(
    async (values: Partial<T>) => {
      try {
        setIsSubmitting(true);

        console.log('call', 'editEndpoint', values);
        const response = await fetch(`http://localhost:3000${editEndpoint}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        onSuccess?.(result);
        messageApi.success('Modifications enregistrées');
        handleClose();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erreur inconnue');
        messageApi.success('Création réussie');
        onError?.(error);
        messageApi.error('Échec de la mise à jour');
      } finally {
        setIsSubmitting(false);
      }
    },
    [editEndpoint, handleClose, onSuccess, onError, messageApi],
  );

  return {
    form,
    isEditing,
    isSubmitting,
    handleOpen,
    handleClose,
    handleSubmit,
  };
}
