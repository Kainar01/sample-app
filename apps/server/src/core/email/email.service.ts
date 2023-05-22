import fs from 'fs/promises';
import path from 'path';

import { Inject, Injectable } from '@nestjs/common';

import {
  EMAIL_GENERATOR,
  EMAIL_MODULE_OPTIONS,
  EMAIL_SENDER,
} from './email.constants';
import {
  EmailGenerator,
  EmailModuleOptions,
  EmailSender,
  SendEmailOptions,
} from './email.interface';
import { APP_ROOT_PATH } from '../../main';

@Injectable()
export class EmailService {
  @Inject(EMAIL_SENDER)
  private readonly emailSender: EmailSender;

  @Inject(EMAIL_GENERATOR)
  private readonly emailGenerator: EmailGenerator;

  @Inject(EMAIL_MODULE_OPTIONS)
  private readonly moduleOptions: EmailModuleOptions;

  public async sendEmail(data: SendEmailOptions): Promise<void> {
    const templateData = await this.loadTemplateContent(data.template);
    const generatedEmail = this.emailGenerator.generate(
      data.subject,
      templateData,
      data.templateVars,
    );

    await this.emailSender.sendEmail(
      {
        ...data,
        ...generatedEmail,
      },
      this.moduleOptions.transportOptions,
    );
  }

  private async loadTemplateContent(templateFile: string): Promise<string> {
    const content = await fs.readFile(
      path.join(APP_ROOT_PATH, 'assets/email-templates', templateFile),
    );

    return content.toString('utf-8');
  }
}
