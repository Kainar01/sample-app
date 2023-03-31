import { Injectable } from '@nestjs/common';

import { CreateTodoInput } from './dto/create-todo.input';
import { Todo } from './dto/todo';
import { TodoRepository } from './todo.repository';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  public async findOneById(id: number): Promise<Todo> {
    return this.todoRepository.findOneById(id);
  }

  public async findAll(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  public async create(data: CreateTodoInput): Promise<Todo> {
    return this.todoRepository.create(data);
  }
}
