import { Injectable } from '@nestjs/common';
import { InjectRedis, RedisClient } from '@techbridge/nestjs/redis';
import moment from 'moment';

import { AuthUser } from './auth.interface';

@Injectable()
export class RedisAuthService {
  private readonly AUTH_USER_KEY: string = 'auth:user';
  private readonly AUTH_USER_TTL_SECONDS: number = moment
    .duration(7, 'days')
    .asSeconds();

  constructor(@InjectRedis('auth') private readonly redisClient: RedisClient) {}

  public async getUser(userId: number): Promise<AuthUser | null> {
    const serializedUser = await this.redisClient.get(this.getUserKey(userId));

    if (!serializedUser) {
      return null;
    }

    return JSON.parse(serializedUser);
  }

  public async setUser(user: AuthUser): Promise<void> {
    await this.redisClient.set(
      this.getUserKey(user.userId),
      JSON.stringify(user),
      'EX',
      this.AUTH_USER_TTL_SECONDS,
    );
  }

  public async deleteUser(userId: number): Promise<void> {
    await this.redisClient.del(this.getUserKey(userId));
  }

  private getUserKey(userId: number): string {
    return `${this.AUTH_USER_KEY}:${userId}`;
  }
}
