import { ErrorsEnum } from '@enums/errors-enums';
import ApiError from '@libs/error-management/api-error';
import { prismaInstance } from '@libs/prisma-client';

const handleErrorCurrentYear = (year: number): void => {
  if (year < 1970 || year > 9999) {
    throw new ApiError('Invalid year for invoice number generation', 400, ErrorsEnum.badRequest);
  }
};

/**
 * Generates the next invoice number for the current year.
 *
 * This function retrieves the current year and attempts to find the last used invoice number
 * for that year from the database. If no invoice number sequence exists for the current year,
 * it initializes the sequence with the last number set to 0. It then increments the last number
 * by 1, updates the sequence in the database, and returns the new invoice number in the format
 * `YYYY-XXXXX`, where `YYYY` is the current year and `XXXXX` is the zero-padded sequence number.
 *
 * @returns {Promise<string>} The next invoice number in the format `YYYY-XXXXX`.
 *
 * @throws {ApiError} If there is an error generating the next invoice number.
 */
export async function generateNextInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();

  handleErrorCurrentYear(currentYear);

  try {
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
  } catch (error) {
    throw new ApiError('Failed to generate next invoice number', 500, ErrorsEnum.internalServerError, {
      originalError: error,
    });
  }
}

/**
 * Generates a preview of the next invoice number for the current year.
 *
 * The invoice number is formatted as `YYYY-XXXXX`, where `YYYY` is the current year
 * and `XXXXX` is a zero-padded sequence number.
 *
 * @returns {Promise<string>} A promise that resolves to the next invoice number as a string.
 *
 * @throws {ApiError} If there is an error retrieving the invoice number sequence from the database.
 */
export async function previewInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();

  handleErrorCurrentYear(currentYear);

  try {
    const seq = await prismaInstance.invoiceNumberSequence.findUnique({
      where: { year: currentYear },
    });

    const nextNumber = (seq?.lastNumber ?? 0) + 1;
    const paddedNumber = nextNumber.toString().padStart(5, '0');
    return `${currentYear}-${paddedNumber}`;
  } catch (error) {
    throw new ApiError('Failed to preview next invoice number', 500, ErrorsEnum.internalServerError, {
      originalError: error,
    });
  }
}

/**
 * Ensures that the provided invoice number is unique.
 *
 * This function checks if an invoice with the given invoice number already exists in the database.
 * If an invoice with the same number is found, it throws an `ApiError` with a 409 status code.
 * If any other error occurs during the process, it throws an `ApiError` with a 500 status code.
 *
 * @param invoiceNumber - The invoice number to check for uniqueness.
 * @throws {ApiError} If the invoice number already exists or if there is an error during the check.
 */
export async function ensureUniqueInvoiceNumber(invoiceNumber: string): Promise<void> {
  try {
    const existing = await prismaInstance.invoice.findUnique({
      where: { invoiceNumber },
    });
    if (existing) {
      throw new ApiError('Invoice number already exists', 409, ErrorsEnum.ressourceAlreadyExists);
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to check invoice number uniqueness', 500, ErrorsEnum.internalServerError, {
      originalError: error,
    });
  }
}
