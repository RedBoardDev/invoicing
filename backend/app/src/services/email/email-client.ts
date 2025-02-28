import { HttpStatusCode } from '@enums/http-status-enums';
import ApiError from '@libs/error-management/api-error';
import nodemailer, { type Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

export function createTransporter(): Transporter {
  if (transporter) {
    return transporter;
  }

  const requiredEnvVars = {
    NODEMAILER_HOST: process.env.NODEMAILER_HOST,
    NODEMAILER_PORT: process.env.NODEMAILER_PORT,
    NODEMAILER_USER: process.env.NODEMAILER_USER,
    NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new ApiError(
      `Variables d’environnement manquantes : ${missingVars.join(', ')}`,
      HttpStatusCode.internalServerError,
    );
  }

  try {
    transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: Number(process.env.NODEMAILER_PORT),
      secure: process.env.NODEMAILER_PORT === '465',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    transporter.verify((error) => {
      if (error) {
        console.error('Erreur de connexion SMTP:', error);
        transporter = null;
        throw new ApiError('Échec de la configuration du transporteur email', HttpStatusCode.internalServerError);
      }
    });

    return transporter;
  } catch (error) {
    throw new ApiError(
      `Erreur lors de la création du transporteur email : ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      HttpStatusCode.internalServerError,
    );
  }
}

export function resetTransporter(): void {
  transporter = null;
}
