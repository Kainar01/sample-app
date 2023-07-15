import { InjectQueue } from '@nestjs/bull';
import { EventsHandler } from '@techbridge/nestjs/event-bus';
import { TechbridgeLogger } from '@techbridge/nestjs/logger';
import { Queue } from 'bull';
import _ from 'lodash';

import { UserSignedUpEvent } from '../../../auth/events/user-signed-up.event';

@EventsHandler(UserSignedUpEvent)
export class UserSignedUpEventHandler {
  constructor(
    @InjectQueue('email-notification') private readonly emailQueue: Queue,
    private readonly logger: TechbridgeLogger,
  ) {}

  public async handle(event: UserSignedUpEvent): Promise<void> {
    this.logger.info('User signed up ', _.pick(event.user, 'id', 'email'));

    await this.emailQueue.add('signup', event.user);
  }
}
