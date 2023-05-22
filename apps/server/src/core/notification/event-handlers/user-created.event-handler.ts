import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TechbridgeLogger } from '@techbridge/util/nestjs/logger';
import _ from 'lodash';

import { EmailService } from '../../email/email.service';
import { UserCreatedEvent } from '../../user/events/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  constructor(
    private readonly logger: TechbridgeLogger,
    private readonly emailService: EmailService,
  ) {}

  public async handle(event: UserCreatedEvent): Promise<void> {
    this.logger.info('User created ', _.pick(event.user, 'id', 'email'));

    await this.emailService
      .sendEmail({
        to: event.user.email,
        subject: 'Thanks for signing up!',
        template: 'signup.hbs',
        templateVars: {
          name: event.user.firstName,
        },
      })
      .catch((error) => {
        this.logger.error(`Error sending email: ${error.message}`, { error });
      });
  }
}
