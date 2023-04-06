import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateTodoInput } from './dto/create-todo.input';
import { Todo } from './dto/todo';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('todoId')
  public async findOne(@Param('todoId') todoId: number): Promise<Todo | null> {
    return this.todoService.findOneById(todoId);
  }

  @Get()
  public async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Post()
  public async create(@Body() dto: CreateTodoInput): Promise<Todo> {
    return this.todoService.create(dto);
  }
}
