import { EventsHandler } from '@techbridge/nestjs/event-bus';
import { TechbridgeLogger } from '@techbridge/nestjs/logger';

import { UserUpdatedEvent } from '../../../user/events/user-updated.event';
import { RedisAuthService } from '../../redis-auth.service';

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedEventHandler {
  constructor(
    private readonly redisAuthService: RedisAuthService,
    private readonly logger: TechbridgeLogger,
  ) {}

  public async handle(event: UserUpdatedEvent): Promise<void> {
    // Invalidate the cache for the user
    await this.redisAuthService.deleteUser(event.userId).catch((error) =>
      this.logger.error('Error deleting auth user from redis', {
        error,
        userId: event.userId,
      }),
    );
  }
}
