import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { COMMAND_HANDLERS } from './commands/handlers';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { KyselyModule } from '../../kysely/kysely.module';
import { PrismaModule } from '../../prisma';

@Module({
  imports: [CqrsModule, PrismaModule, KyselyModule],
  providers: [UserResolver, UserService, UserRepository, ...COMMAND_HANDLERS],
  exports: [UserService],
})
export class UserModule {}
