import type React from 'react';
import { useState, useCallback } from 'react';
import { useMessage } from '@hooks/useMessage';
import type { EmailVariable } from '@enums/emailVariables';
import type { EmailTemplate, CursorPositions, FormRefs } from './types';
import type { FormInstance } from 'antd';
import { createEmailTemplate, updateEmailTemplate } from '@api/services/emailTemplates';

export const useEmailTemplateLogic = (
  form: FormInstance<EmailTemplate>,
  template: EmailTemplate | null,
  onSuccess: () => void,
  onClose: () => void,
  { subjectRef, contentRef }: FormRefs,
) => {
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<'subject' | 'content'>('content');
  const [cursorPositions, setCursorPositions] = useState<CursorPositions>({ subject: 0, content: 0 });
  const messageApi = useMessage();

  const updateCursorPosition = useCallback((field: 'subject' | 'content', pos: number) => {
    setCursorPositions((prev) => ({ ...prev, [field]: pos }));
  }, []);

  const insertVariable = useCallback(
    (variable: EmailVariable) => {
      const fieldName = activeField;
      const fieldValue = form.getFieldValue(fieldName) || '';
      const ref = fieldName === 'subject' ? subjectRef : contentRef;
      const input = ref.current?.input as HTMLInputElement | HTMLTextAreaElement | null;
      const cursorPosition =
        typeof cursorPositions[fieldName] === 'number'
          ? cursorPositions[fieldName]
          : (input?.selectionStart ?? fieldValue.length);

      const placeholder = `{{${variable}}}`;
      const newValue = `${fieldValue.slice(0, cursorPosition)}${placeholder}${fieldValue.slice(cursorPosition)}`;
      form.setFieldsValue({ [fieldName]: newValue });

      setTimeout(() => {
        ref.current?.focus();
        const newCursorPosition = cursorPosition + placeholder.length;
        updateCursorPosition(fieldName, newCursorPosition);
        input?.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    },
    [activeField, form, cursorPositions, subjectRef, contentRef, updateCursorPosition],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: 'subject' | 'content') => {
      const input = e.target as HTMLInputElement | HTMLTextAreaElement;
      const cursorStart = input.selectionStart ?? 0;
      const cursorEnd = input.selectionEnd ?? 0;
      const value = form.getFieldValue(fieldName) || '';

      if (e.key === 'Backspace' || e.key === 'Delete') {
        const regex = /\{\{(\w+)\}\}/g;
        let match: RegExpExecArray | null;
        while (true) {
          match = regex.exec(value);
          if (match === null) break;
          const start = match.index;
          const end = start + match[0].length;

          if (
            (e.key === 'Backspace' && cursorStart === end && cursorEnd === end) ||
            (e.key === 'Delete' && cursorStart === start && cursorEnd === start) ||
            (cursorStart >= start && cursorEnd <= end)
          ) {
            e.preventDefault();
            const newValue = `${value.slice(0, start)}${value.slice(end)}`;
            form.setFieldsValue({ [fieldName]: newValue });

            setTimeout(() => {
              input.focus();
              input.setSelectionRange(start, start);
              updateCursorPosition(fieldName, start);
            }, 0);
            break;
          }
        }
      }
    },
    [form, updateCursorPosition],
  );

  const handleSubmit = useCallback(
    async (values: Partial<EmailTemplate>) => {
      setLoading(true);
      try {
        const result = template
          ? await updateEmailTemplate(template.id, values)
          : await createEmailTemplate(values as Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>);

        if (!result.success) throw new Error(result.error || 'Erreur lors de la sauvegarde');
        messageApi?.success(template ? 'Template mis à jour' : 'Template créé avec succès');
        form.resetFields();
        onSuccess();
        onClose();
      } catch (error) {
        messageApi?.error('Erreur lors de la sauvegarde');
      } finally {
        setLoading(false);
      }
    },
    [template, form, onSuccess, onClose, messageApi],
  );

  return {
    loading,
    activeField,
    setActiveField,
    insertVariable,
    handleKeyDown,
    handleSubmit,
    updateCursorPosition,
  };
};
