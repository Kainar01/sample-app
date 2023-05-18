import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { ClientNamespace, RedisClient } from '@techbridge/nestjs/redis';

import { PrismaService } from '../../prisma';

@Injectable()
export class HealthIndicatorService extends HealthIndicator {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async checkDB(): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return this.getStatus('database', true);
    } catch (e) {
      throw new HealthCheckError('Prisma check failed', e);
    }
  }

  public async checkRedisClient(
    client: RedisClient,
    namespace: ClientNamespace,
  ): Promise<HealthIndicatorResult> {
    try {
      await client.ping();
      return this.getStatus(`redis-${String(namespace)}`, true);
    } catch (e) {
      throw new HealthCheckError(
        `Redis client ${String(namespace)} check failed`,
        e,
      );
    }
  }
}
