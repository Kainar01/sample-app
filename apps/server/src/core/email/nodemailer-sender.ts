import fs from 'fs/promises';
import path from 'path';

import { Injectable } from '@nestjs/common';
import { TechbridgeLogger } from '@techbridge/util/nestjs/logger';
import _ from 'lodash';
import { createTransport, Transporter } from 'nodemailer';

import {
  EmailOptions,
  EmailSender,
  SendmailTransportOptions,
  SMTPOptions,
  TransportOptions,
} from './email.interface';

@Injectable()
export class NodemailerEmailSender implements EmailSender {
  constructor(private readonly logger: TechbridgeLogger) {}

  public async sendEmail(
    email: EmailOptions,
    transportOptions: TransportOptions,
  ): Promise<void> {
    const { type } = transportOptions;

    const emailOptions = this.prepareEmailOptions(email, transportOptions);

    switch (type) {
      case 'smtp':
        return this.sendMail(
          emailOptions,
          this.getSmtpTransport(transportOptions),
        );
      case 'sendmail':
        return this.sendMail(
          emailOptions,
          this.getSendMailTransport(transportOptions),
        );
      case 'file':
        return this.saveToFile(emailOptions, transportOptions.outputPath);
      case 'none':
        return this.logEmail(emailOptions);
      default:
        throw new Error(`Transport ${type} is not supported`);
    }
  }

  private async saveToFile(
    email: EmailOptions,
    outputDir: string,
  ): Promise<void> {
    const filename = `${new Date().toISOString()}_${email.to}_${
      email.subject
    }.json`;
    const filePath = path.join(outputDir, filename);

    await fs.writeFile(filePath, JSON.stringify(email, null, 2));
  }

  private logEmail(email: EmailOptions): void {
    this.logger.info(
      `Email sent: ${new Date().toISOString()}, To: ${email.to}, Subject: ${
        email.subject
      }`,
    );
  }

  private async sendMail(
    email: EmailOptions,
    transporter: Transporter,
  ): Promise<void> {
    await transporter.sendMail({
      from: email.from,
      to: email.to,
      cc: email.cc,
      bcc: email.bcc,
      subject: email.subject,
      replyTo: email.replyTo,
      html: email.html,
      text: email.text,
      attachments: email.attachments,
    });
  }

  private getSmtpTransport(options: SMTPOptions): Transporter {
    return createTransport({
      host: options.host,
      port: options.port,
      secure: options.secure,
      auth: {
        user: options.username,
        pass: options.password,
      },
    });
  }

  private getSendMailTransport(options: SendmailTransportOptions): Transporter {
    return createTransport({
      sendmail: true,
      newline: options.newline,
      path: options.path,
    });
  }

  /**
   * Assigns default mail options from `TransportOptions` to email options if there are not defined
   * @param options EmailOptions
   * @param transportOptions TransportOptions
   * @returns EmailOptions
   */
  private prepareEmailOptions(
    options: EmailOptions,
    transportOptions: TransportOptions,
  ): EmailOptions {
    return _.defaults(options, {
      from: transportOptions.from,
      replyTo: transportOptions.replyTo,
    });
  }
}
