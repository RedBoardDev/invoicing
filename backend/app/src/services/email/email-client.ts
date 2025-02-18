import nodemailer, { type Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

export function createTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: Number(process.env.NODEMAILER_PORT),
      secure: true,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });
  }
  return transporter;
}
