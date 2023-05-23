import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { EVENT_HANDLERS } from './events/handlers';
import { QUEUES } from './queues';
import { EmailModule } from '../email/email.module';

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
