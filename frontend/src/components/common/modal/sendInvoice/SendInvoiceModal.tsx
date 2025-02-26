import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import type Invoice from '@interfaces/invoice';

interface SendInvoiceModalProps {
  visible: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onSuccess: () => void;
}

const SendInvoiceModal: React.FC<SendInvoiceModalProps> = ({ visible, invoice, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [isSending, setIsSending] = useState(false);

  const fetchEmailData = useCallback(
    async (invoice: Invoice) => {
      try {
        console.log('invoice', invoice);
        const response = await fetch(
          `http://localhost:3000/email-templates/${invoice.contract?.emailTemplateId}/simulate/${invoice.id}`,
        );
        if (!response.ok) throw new Error('Erreur lors de la récupération des données');
        const { email, subject, content } = await response.json();
        form.setFieldsValue({
          recipientEmail: email || '',
          subject: subject || '',
          content: content || '',
        });
      } catch (error) {
        message.error('Erreur lors de la récupération des données de l’email');
      }
    },
    [form],
  );

  useEffect(() => {
    if (!visible || !invoice) return;
    fetchEmailData(invoice);
  }, [visible, invoice, fetchEmailData]);

  const handleSend = async () => {
    try {
      const values = await form.validateFields();
      setIsSending(true);
      const response = await fetch(`http://localhost:3000/invoices/${invoice?.id}/send`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Erreur lors de l’envoi');
      message.success('Facture envoyée avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      message.error('Erreur lors de l’envoi de la facture');
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
