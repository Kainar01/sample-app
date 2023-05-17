import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserUpdatedHandler } from './events-handlers/user-updated.event-handler';
import { PasswordService } from './password.service';
import { RedisAuthService } from './redis-auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { PrismaModule } from '../../prisma';

const EVENT_HANDLERS = [UserUpdatedHandler];
const SERVICES = [AuthService, PasswordService, RedisAuthService];
const STRATEGIES = [RefreshJwtStrategy, JwtStrategy];

@Module({
  imports: [JwtModule, PrismaModule],
  providers: [AuthResolver, ...STRATEGIES, ...SERVICES, ...EVENT_HANDLERS],
})
export class AuthModule {}
