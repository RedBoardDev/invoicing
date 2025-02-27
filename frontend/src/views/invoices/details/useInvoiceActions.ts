import { useCallback, useState } from 'react';
import type Invoice from '@interfaces/invoice';
import { useMessage } from '@hooks/useMessage';

export const useInvoiceActions = (invoice: Invoice | null, refresh: () => void) => {
  const messageApi = useMessage();
  const [isValidating, setIsValidating] = useState(false);
  const [isMarkingAsPaid, setIsMarkingAsPaid] = useState(false);

  const validateInvoice = useCallback(async () => {
    if (!invoice?.id) return;
    setIsValidating(true);
    try {
      const response = await fetch(`http://localhost:3000/invoices/${invoice.id}/validate`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la validation');
      }
      messageApi.success('Facture validée avec succès');
      refresh();
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Erreur lors de la validation');
    } finally {
      setIsValidating(false);
    }
  }, [invoice, refresh, messageApi]);

  const markAsPaid = useCallback(async () => {
    if (!invoice?.id) return;
    setIsMarkingAsPaid(true);
    try {
      const response = await fetch(`http://localhost:3000/invoices/${invoice.id}/paid`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec du marquage comme payé');
      }
      messageApi.success('Facture marquée comme payée');
      refresh();
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Erreur lors du marquage');
    } finally {
      setIsMarkingAsPaid(false);
    }
  }, [invoice, refresh, messageApi]);

  return {
    validateInvoice,
    markAsPaid,
    isValidating,
    isMarkingAsPaid,
  };
};