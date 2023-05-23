import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { COMMAND_HANDLERS } from './commands/handlers';
import { EVENT_HANDLERS } from './events/handlers';
import { PasswordService } from './password.service';
import { RedisAuthService } from './redis-auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { PrismaModule } from '../../prisma';
import { UserModule } from '../user/user.module';

const SERVICES = [AuthService, PasswordService, RedisAuthService];
const STRATEGIES = [RefreshJwtStrategy, JwtStrategy];

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
