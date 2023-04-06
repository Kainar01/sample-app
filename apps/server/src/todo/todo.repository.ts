import { Injectable } from '@nestjs/common';

import { CreateTodoInput } from './dto/create-todo.input';
import { Todo } from './dto/todo';
import { PrismaService } from '../prisma';

@Injectable()
export class TodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findOneById(id: number): Promise<Todo | null> {
    return this.prisma.todo.findFirst({ where: { id } });
  }

  public async findAll(): Promise<Todo[]> {
    return this.prisma.todo.findMany();
  }

  public async create(data: CreateTodoInput): Promise<Todo> {
    return this.prisma.todo.create({ data });
  }
}
