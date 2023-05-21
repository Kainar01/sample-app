import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaModule } from '../../prisma';

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
