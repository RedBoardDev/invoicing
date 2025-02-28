import type { Buffer } from 'node:buffer';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import S3ClientLib from '@libs/s3-client';
import { v4 as uuidv4 } from 'uuid';

const s3Lib = S3ClientLib.getInstance();
const s3Client = s3Lib.getClient();
const bucketName = s3Lib.getBucketName();

export const uploadPdfToS3 = async (pdfBuffer: Buffer): Promise<string> => {
  const fileId = uuidv4();
  const key = `invoices/${fileId}.pdf`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: pdfBuffer,
    ContentType: 'application/pdf',
  });

  await s3Client.send(command);

  return fileId;
};
