import { InjectQueue } from '@nestjs/bull';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TechbridgeLogger } from '@techbridge/util/nestjs/logger';
import { Queue } from 'bull';
import _ from 'lodash';

import { UserCreatedEvent } from '../../user/events/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  constructor(
    @InjectQueue('email-notification') private readonly emailQueue: Queue,
    private readonly logger: TechbridgeLogger,
  ) {}

  public async handle(event: UserCreatedEvent): Promise<void> {
    this.logger.info('User created ', _.pick(event.user, 'id', 'email'));

    await this.emailQueue.add('signup', event.user);
  }
}
