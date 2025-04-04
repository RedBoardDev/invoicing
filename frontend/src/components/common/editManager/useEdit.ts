import { useState, useCallback } from 'react';
import { Form } from 'antd';
import { useMessage } from '@hooks/useMessage';
import { shallowEqual } from '@utils';
import type { Result, ApiResponse } from '@api/types/fetch';

type UseEditProps<T> = {
  data?: T | null;
  updateService: (id: string, data: Partial<T>) => Promise<Result<ApiResponse<T>>>;
  id: string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};

export default function useEdit<T extends object>({ data, updateService, id, onSuccess, onError }: UseEditProps<T>) {
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

  const getChangedFields = useCallback((initialData: T | null, newValues: Partial<T>): Partial<T> => {
    if (!initialData) return newValues;

    const changedFields: Partial<T> = {};
    for (const key in newValues) {
      const typedKey = key as keyof T;
      if (
        Object.prototype.hasOwnProperty.call(newValues, typedKey) &&
        !shallowEqual(newValues[typedKey], initialData[typedKey])
      ) {
        changedFields[typedKey] = newValues[typedKey];
      }
    }
    return changedFields;
  }, []);

  const handleSubmit = useCallback(
    async (values: Partial<T>) => {
      try {
        setIsSubmitting(true);

        const changedValues = getChangedFields(data ?? null, values);

        if (Object.keys(changedValues).length === 0) {
          messageApi.info('Aucune modification détectée');
          handleClose();
          return;
        }

        const result = await updateService(id, changedValues);
        if (!result.success) throw new Error(result.error || 'Erreur lors de la mise à jour');

        onSuccess?.(result.data.data);
        messageApi.success('Modifications enregistrées');
        handleClose();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erreur inconnue');
        onError?.(error);
        messageApi.error(error.message || 'Échec de la mise à jour');
      } finally {
        setIsSubmitting(false);
      }
    },
    [id, updateService, handleClose, onSuccess, onError, messageApi, data, getChangedFields],
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
