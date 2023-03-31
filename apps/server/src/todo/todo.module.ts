import { Module } from '@nestjs/common';

import { TodoController } from './todo.controller';
import { TodoRepository } from './todo.repository';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule],
  providers: [TodoResolver, TodoController, TodoService, TodoRepository],
})
export class TodoModule {}
