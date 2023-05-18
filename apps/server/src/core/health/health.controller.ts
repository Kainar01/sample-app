import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  HealthCheckResult,
} from '@nestjs/terminus';
import { InjectRedisClients, RedisClients } from '@techbridge/nestjs/redis';

import { HealthIndicatorService } from './health-indicator.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly healthIndicatorService: HealthIndicatorService,
    @InjectRedisClients() private readonly redisClients: RedisClients,
  ) {}

  @Get()
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    const healthChecks = [async () => this.healthIndicatorService.checkDB()];

    // check each redis clients
    this.redisClients.forEach((client, namespace) => {
      healthChecks.push(async () =>
        this.healthIndicatorService.checkRedisClient(client, namespace),
      );
    });

    return this.health.check(healthChecks);
  }
}
