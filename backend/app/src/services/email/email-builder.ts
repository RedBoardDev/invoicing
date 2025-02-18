import { ErrorsEnum } from '@enums/errors-enums';
import ApiError from '@libs/error-management/api-error';
import type { Transporter } from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import { createTransporter } from './email-client';

export class EmailBuilder {
  private mailOptions: Partial<Mail.Options> = {};
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransporter();
  }

  setRecipients(recipients: string[]): this {
    this.mailOptions.to = recipients.join(', ');
    return this;
  }

  setSubject(subject: string): this {
    this.mailOptions.subject = subject;
    return this;
  }

  setContent(content: string): this {
    this.mailOptions.html = content;
    return this;
  }

  async send(): Promise<void> {
    try {
      this.validateOptions();
      await this.transporter.sendMail({
        from: `"Service" <${process.env.NODEMAILER_USER}>`,
        ...this.mailOptions,
      });
    } catch (error) {
      throw new ApiError('Échec denvoi de lemail', 500, ErrorsEnum.internalServerError, { originalError: error });
    }
  }

  private validateOptions(): void {
    const required: (keyof Mail.Options)[] = ['to', 'subject', 'html'];
    const missing = required.filter((field) => !this.mailOptions[field]);

    if (missing.length) {
      throw new ApiError(`Champs manquants: ${missing.join(', ')}`, 400, ErrorsEnum.badRequest);
    }
  }
}
