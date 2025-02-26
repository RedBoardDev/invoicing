import { useCallback, useState } from 'react';
import type Invoice from '@interfaces/invoice';
import { useMessage } from '@hooks/useMessage';

export const useInvoiceActions = (invoice: Invoice | null, refresh: () => void) => {
  const messageApi = useMessage();
  const [isValidating, setIsValidating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isMarkingAsPaid, setIsMarkingAsPaid] = useState(false);

  const validateInvoice = useCallback(async () => {
    if (!invoice?.id) return;
    setIsValidating(true);
    try {
      const response = await fetch(`http://localhost:3000/invoices/${invoice.id}/validate`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Échec de la validation');
      messageApi.success('Facture validée avec succès');
      refresh();
    } catch (error) {
      messageApi.error('Erreur lors de la validation');
    } finally {
      setIsValidating(false);
    }
  }, [invoice, refresh, messageApi]);

  const sendInvoice = useCallback(async () => {
    if (!invoice?.id) return;
    setIsSending(true);
    try {
      console.log('Envoi de la facture');
      messageApi.success('Facture envoyée (simulation)');
      refresh();
    } catch (error) {
      messageApi.error('Erreur lors de l’envoi');
    } finally {
      setIsSending(false);
    }
  }, [invoice, refresh, messageApi]);

  const markAsPaid = useCallback(async () => {
    if (!invoice?.id) return;
    setIsMarkingAsPaid(true);
    try {
      const response = await fetch(`http://localhost:3000/invoices/${invoice.id}/paid`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Échec du marquage comme payé');
      messageApi.success('Facture marquée comme payée');
      refresh();
    } catch (error) {
      messageApi.error('Erreur lors du marquage');
    } finally {
      setIsMarkingAsPaid(false);
    }
  }, [invoice, refresh, messageApi]);

  return {
    validateInvoice,
    sendInvoice,
    markAsPaid,
    isValidating,
    isSending,
    isMarkingAsPaid,
  };
};
