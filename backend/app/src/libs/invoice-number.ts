import { ErrorsEnum } from '@enums/errors-enums';
import ApiError from '@libs/error-management/api-error';
import { prismaInstance } from '@libs/prisma-client';

export async function generateNextInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();

  const sequence = await prismaInstance.$transaction(async (prisma) => {
    let seq = await prisma.invoiceNumberSequence.findUnique({
      where: { year: currentYear },
    });

    if (!seq) {
      seq = await prisma.invoiceNumberSequence.create({
        data: { year: currentYear, lastNumber: 0 },
      });
    }

    const nextNumber = seq.lastNumber + 1;
    await prisma.invoiceNumberSequence.update({
      where: { year: currentYear },
      data: { lastNumber: nextNumber },
    });

    return nextNumber;
  });

  const paddedNumber = sequence.toString().padStart(5, '0');
  return `${currentYear}-${paddedNumber}`;
}

export async function ensureUniqueInvoiceNumber(invoiceNumber: string): Promise<void> {
  const existing = await prismaInstance.invoice.findUnique({
    where: { invoiceNumber },
  });
  if (existing) {
    throw new ApiError('Invoice number already exists', 409, ErrorsEnum.ressourceAlreadyExists);
  }
}

export async function previewInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const seq = await prismaInstance.invoiceNumberSequence.findUnique({
    where: { year: currentYear },
  });
  const nextNumber = (seq?.lastNumber || 0) + 1;
  return `${currentYear}-${nextNumber.toString().padStart(5, '0')}`;
}
