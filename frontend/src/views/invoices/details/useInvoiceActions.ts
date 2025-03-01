import { useCallback, useState } from 'react';
import type Invoice from '@interfaces/invoice';
import { useMessage } from '@hooks/useMessage';
import { validateInvoice, markInvoiceAsPaid } from '@api/services/invoices';

export const useInvoiceActions = (invoice: Invoice | null, refresh: () => void) => {
  const messageApi = useMessage();
  const [isValidating, setIsValidating] = useState(false);
  const [isMarkingAsPaid, setIsMarkingAsPaid] = useState(false);

  const validateInvoiceAction = useCallback(async () => {
    if (!invoice?.id) return;
    setIsValidating(true);
    try {
      const result = await validateInvoice(invoice.id);
      if (!result.success) throw new Error(result.error || 'Échec de la validation');
      messageApi.success('Facture validée avec succès');
      refresh();
    } catch (error) {
      messageApi.error('Erreur lors de la validation');
    } finally {
      setIsValidating(false);
    }
  }, [invoice, refresh, messageApi]);

  const markAsPaidAction = useCallback(async () => {
    if (!invoice?.id) return;
    setIsMarkingAsPaid(true);
    try {
      const result = await markInvoiceAsPaid(invoice.id);
      if (!result.success) throw new Error(result.error || 'Échec du marquage comme payé');
      messageApi.success('Facture marquée comme payée');
      refresh();
    } catch (error) {
      messageApi.error('Erreur lors du marquage');
    } finally {
      setIsMarkingAsPaid(false);
    }
  }, [invoice, refresh, messageApi]);

  return {
    validateInvoice: validateInvoiceAction,
    markAsPaid: markAsPaidAction,
    isValidating,
    isMarkingAsPaid,
  };
};
