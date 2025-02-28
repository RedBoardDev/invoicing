import { S3Client } from '@aws-sdk/client-s3';
import { ErrorsEnum } from '@enums/errors-enums';
import { HttpStatusCode } from '@enums/http-status-enums';
import ApiError from './error-management/api-error';

class S3ClientLib {
  private static instance: S3ClientLib | null = null;
  private s3Client: S3Client;
  private bucketName: string;

  private constructor() {
    const region = process.env.AWS_DEFAULT_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const bucketName = process.env.S3_BUCKET_NAME;

    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new ApiError('Internal server error', HttpStatusCode.internalServerError, ErrorsEnum.internalServerError);
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucketName = bucketName;
  }

  public static getInstance(): S3ClientLib {
    if (!S3ClientLib.instance) {
      S3ClientLib.instance = new S3ClientLib();
    }
    return S3ClientLib.instance;
  }

  public getClient(): S3Client {
    return this.s3Client;
  }

  public getBucketName(): string {
    return this.bucketName;
  }
}

export default S3ClientLib;
