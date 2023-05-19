/* eslint-disable import/extensions */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { SMTPOptions } from './email.interface';

@Injectable()
export class TransporterFactory {
  public async createSendGridTransporter(): nodemailer.Transporter {
    // import dynamically, so that env vars are not checked if not used
    const { SendGridConfig } = await import(
      '../../config/mail/sendgrid.config'
    );

    return this.createTransporter({
      host: SendGridConfig.HOST,
      port: SendGridConfig.PORT,
      secure: SendGridConfig.SECURE,
      username: SendGridConfig.AUTH_USER,
      password: SendGridConfig.API_KEY,
    });
  }

  public async createNodeMailerTransporter(): nodemailer.Transporter {
    const testAccount = await nodemailer.createTestAccount();

    return this.createTransporter({
      ...testAccount.smtp,
      username: testAccount.user,
      password: testAccount.pass,
    });
  }

  public createTransporter(options: SMTPOptions): nodemailer.Transporter {
    const transporter = nodemailer.createTransport(options);
    return transporter;
  }
}
