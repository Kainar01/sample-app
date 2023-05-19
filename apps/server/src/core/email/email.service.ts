import { Injectable } from '@nestjs/common';
import Email from 'email-templates';
import { Transporter } from 'nodemailer';

import { TransporterFactory } from './transporter.factory';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  constructor(private readonly transporterFactory: TransporterFactory) {
    this.transporter = this.transporterFactory.createSendGridTransporter();
  }

  public getEmailInstance(): Email {}
}
