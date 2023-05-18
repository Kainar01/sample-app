import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';


import { HealthIndicatorService } from './health-indicator.service';
import { HealthController } from './health.controller';
import { PrismaModule } from '../../prisma';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthController],
  providers: [HealthIndicatorService],
})
export class HealthModule {}
