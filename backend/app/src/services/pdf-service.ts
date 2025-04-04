import type { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import type { Invoice } from '@prisma/client';
import pdfMake from 'pdfmake/build/pdfmake';
import { generateInvoicePdfDefinition } from '../templates/pdf/invoice';

const robotoRegular = fs.readFileSync(path.resolve(__dirname, '../assets/fonts/Roboto-Regular.ttf'));
const robotoBold = fs.readFileSync(path.resolve(__dirname, '../assets/fonts/Roboto-Bold.ttf'));

// Configuration des polices dans le VFS
pdfMake.vfs = {
  'Roboto-Regular.ttf': robotoRegular.toString('base64'),
  'Roboto-Bold.ttf': robotoBold.toString('base64'),
};

pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Bold.ttf',
  },
};

export const generateInvoicePdf = async (invoice: Invoice): Promise<Buffer> => {
  const docDefinition = generateInvoicePdfDefinition(invoice);

  return new Promise((resolve) => {
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.getBuffer((buffer) => resolve(buffer));
  });
};
