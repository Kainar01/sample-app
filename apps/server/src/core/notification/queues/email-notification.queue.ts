import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { User } from '@prisma/client';
import { TechbridgeLogger } from '@techbridge/nestjs/logger';
import { Job } from 'bull';

import { EmailService } from '../../email/email.service';

@Processor('email-notification')
export class EmailNotificationQueue {
  constructor(
    private readonly logger: TechbridgeLogger,
    private readonly emailService: EmailService,
  ) {}

  @Process('signup')
  public async processSignup(job: Job<User>): Promise<void> {
    const user = job.data;

    await this.emailService
      .sendEmail({
        to: user.email,
        subject: 'Thanks for signing up!',
        template: 'signup.hbs',
        templateVars: {
          name: user.firstName,
        },
      })
      .catch((error) => {
        this.logger.error(`Error sending email: ${error.message}`, { error });
      });
  }

  @OnQueueActive()
  public onActive(job: Job): void {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueCompleted()
  public onCompleted(job: Job): void {
    this.logger.log(
      `Completed job ${job.id} of type ${job.name} with result ${job.returnvalue}`,
    );
  }

  @OnQueueFailed()
  public onFailed(job: Job<User>, error: Error): void {
    this.logger.error(`Error sending email for processor ${job.name}`, {
      error,
      job,
    });
  }
}
