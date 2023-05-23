import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { SignupHandler } from './commands/handlers/signup.handler';
import { UserUpdatedEventHandler } from './events-handlers/user-updated.event-handler';
import { PasswordService } from './password.service';
import { RedisAuthService } from './redis-auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { PrismaModule } from '../../prisma';
import { UserModule } from '../user/user.module';

const EVENT_HANDLERS = [UserUpdatedEventHandler];
const SERVICES = [AuthService, PasswordService, RedisAuthService];
const STRATEGIES = [RefreshJwtStrategy, JwtStrategy];
const COMMAND_HANDLERS = [SignupHandler];

@Module({
  imports: [CqrsModule, JwtModule, PrismaModule, UserModule],
  providers: [
    AuthResolver,
    ...STRATEGIES,
    ...SERVICES,
    ...EVENT_HANDLERS,
    ...COMMAND_HANDLERS,
  ],
})
export class AuthModule {}
