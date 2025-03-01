import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import type Invoice from '@interfaces/invoice';
import { useMessage } from '@hooks/useMessage';
import { sendInvoice } from '@api/services/invoices';
import { simulateEmailTemplate } from '@api/services/emailTemplates';
import type { WithExtends } from '@api/types/extends';

interface SendInvoiceModalProps {
  visible: boolean;
  invoice: WithExtends<Invoice, 'contract'> | null;
  onClose: () => void;
  onSuccess: () => void;
}

const SendInvoiceModal: React.FC<SendInvoiceModalProps> = ({ visible, invoice, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [isSending, setIsSending] = useState(false);
  const messageApi = useMessage();

  const fetchEmailData = useCallback(
    async (invoice: WithExtends<Invoice, 'contract'>) => {
      if (!invoice.contract?.emailTemplateId) return;
      try {
        const result = await simulateEmailTemplate(invoice.contract.emailTemplateId, invoice.id);
        if (!result.success) throw new Error(result.error || 'Erreur lors de la récupération des données');
        const { email, subject, content } = result.data.data;
        form.setFieldsValue({ recipientEmail: email || '', subject: subject || '', content: content || '' });
      } catch (error) {
        messageApi.error('Erreur lors de la récupération des données de l’email');
      }
    },
    [form, messageApi],
  );

  useEffect(() => {
    if (!visible || !invoice) return;
    fetchEmailData(invoice);
  }, [visible, invoice, fetchEmailData]);

  const handleSend = async () => {
    try {
      setIsSending(true);
      const values = await form.validateFields();
      if (!invoice?.id) throw new Error('Aucune facture sélectionnée');

      const result = await sendInvoice(invoice.id, values);
      if (!result.success) throw new Error(result.error || 'Erreur lors de l’envoi');

      messageApi.success('Facture envoyée avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      messageApi.error('Erreur lors de l’envoi de la facture');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      title="Envoyer la facture"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Annuler
        </Button>,
        <Button key="send" type="primary" onClick={handleSend} loading={isSending}>
          Envoyer
        </Button>,
      ]}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="recipientEmail"
          label="Email du destinataire"
          rules={[{ required: true, type: 'email', message: 'Veuillez entrer un email valide' }]}>
          <Input placeholder="Email du destinataire" />
        </Form.Item>
        <Form.Item name="subject" label="Objet" rules={[{ required: true, message: 'L’objet est obligatoire' }]}>
          <Input placeholder="Objet de l’email" />
        </Form.Item>
        <Form.Item name="content" label="Contenu" rules={[{ required: true, message: 'Le contenu est obligatoire' }]}>
          <Input.TextArea rows={6} placeholder="Contenu de l’email" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SendInvoiceModal;
