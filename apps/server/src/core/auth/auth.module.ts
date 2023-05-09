import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { PrismaModule } from '../../prisma';

@Module({
  imports: [JwtModule, PrismaModule],
  providers: [
    AuthResolver,
    AuthService,
    PasswordService,
    RefreshJwtStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
