import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateTodoInput } from './dto/create-todo.input';
import { Todo } from './dto/todo';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  public async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Post()
  public async create(@Body() dto: CreateTodoInput): Promise<Todo> {
    return this.todoService.create(dto);
  }
}
