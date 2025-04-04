import type { Invoice } from '@prisma/client';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

export const generateInvoicePdfDefinition = (invoice: Invoice): TDocumentDefinitions => ({
  content: [
    { text: `Facture #${invoice.invoiceNumber}`, style: 'header' },
    { text: `Statut: ${invoice.status}`, margin: [0, 10] },
    { text: `Montant HT: ${invoice.amountHT} €`, margin: [0, 10] },
    { text: `Taux de taxe: ${invoice.taxRate}%`, margin: [0, 10] },
    { text: `Date d'échéance: ${new Date(invoice.dueDate).toLocaleDateString()}`, margin: [0, 10] },
  ],
  styles: {
    header: { fontSize: 18, bold: true },
  },
});
