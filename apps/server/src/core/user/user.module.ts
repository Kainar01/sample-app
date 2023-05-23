import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { COMMAND_HANDLERS } from './commands/handlers';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaModule } from '../../prisma';

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [UserResolver, UserService, ...COMMAND_HANDLERS],
  exports: [UserService],
})
export class UserModule {}
