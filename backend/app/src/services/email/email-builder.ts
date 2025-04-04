// app/src/services/email/email-builder.ts
import { createTransporter } from '@services/email/email-client';
import type { SentMessageInfo } from 'nodemailer';

export class EmailBuilder {
  private mailOptions: {
    from?: string;
    to?: string | string[];
    subject?: string;
    html?: string;
    attachments?: { filename: string; path?: string; content?: Buffer }[];
  } = {};

  constructor() {
    this.mailOptions.from = process.env.NODEMAILER_USER;
  }

  setRecipients(recipients: string[]): this {
    this.mailOptions.to = recipients;
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

  addAttachment(attachment: { filename: string; path?: string; content?: Buffer }): this {
    if (!this.mailOptions.attachments) {
      this.mailOptions.attachments = [];
    }
    this.mailOptions.attachments.push(attachment);
    return this;
  }

  async send(): Promise<SentMessageInfo> {
    const transporter = createTransporter();
    return transporter.sendMail(this.mailOptions);
  }
}
