import { Module } from '@nestjs/common';

import { UserCreatedEventHandler } from './event-handlers/user-created.event-handler';
import { EmailModule } from '../email/email.module';


const EVENT_HANDLERS = [UserCreatedEventHandler];

@Module({
  imports: [EmailModule],
  controllers: [],
  providers: [...EVENT_HANDLERS],
})
export class NotificationModule {}
