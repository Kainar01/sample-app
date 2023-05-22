import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { UserCreatedEventHandler } from './event-handlers/user-created.event-handler';
import { EmailNotificationQueue } from './queues/email-notification.queue';
import { EmailModule } from '../email/email.module';

const EVENT_HANDLERS = [UserCreatedEventHandler];
const QUEUES = [EmailNotificationQueue];

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-notification',
    }),
    EmailModule,
  ],
  controllers: [],
  providers: [...EVENT_HANDLERS, ...QUEUES],
})
export class NotificationModule {}
