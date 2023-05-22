import { Module, Provider } from '@nestjs/common';

import {
  EMAIL_GENERATOR,
  EMAIL_MODULE_OPTIONS,
  EMAIL_SENDER,
} from './email.constants';
import {
  EmailGenerator,
  EmailModuleOptions,
  EmailSender,
  TransportOptions,
} from './email.interface';
import { EmailService } from './email.service';
import { HandlebarsEmailGenerator } from './handlebars-email-generator';
import { NodemailerEmailSender } from './nodemailer-sender';
import { SendGridConfig } from '../../config/sendgrid.config';
import { PrismaModule } from '../../prisma';

const transportOptions: TransportOptions = {
  type: 'smtp',
  host: SendGridConfig.HOST,
  port: SendGridConfig.PORT,
  username: SendGridConfig.API_KEY_NAME,
  password: SendGridConfig.API_KEY,
  secure: SendGridConfig.SECURE,
  from: SendGridConfig.FROM_ADDRESS,
};

const emailModuleOptions: EmailModuleOptions = {
  transportOptions,
};

function createProviders(): Provider[] {
  const emailSenderProvider: Provider<EmailSender> = {
    provide: EMAIL_SENDER,
    useClass: NodemailerEmailSender,
  };

  const emailGeneratorProvider: Provider<EmailGenerator> = {
    provide: EMAIL_GENERATOR,
    useClass: HandlebarsEmailGenerator,
  };

  const optionsProvider: Provider<EmailModuleOptions> = {
    provide: EMAIL_MODULE_OPTIONS,
    useValue: emailModuleOptions,
  };

  return [emailSenderProvider, emailGeneratorProvider, optionsProvider];
}

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [...createProviders(), EmailService],
  exports: [EmailService],
})
export class EmailModule {}
