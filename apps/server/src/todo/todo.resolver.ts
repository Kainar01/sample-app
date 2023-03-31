import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateTodoArgs } from './dto/create-todo.args';
import { FindTodoArgs } from './dto/find-todo.args';
import { Todo } from './dto/todo';
import { TodoService } from './todo.service';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private todoService: TodoService) {}

  @Query(() => Todo, { nullable: true })
  public async todo(@Args() { todoId }: FindTodoArgs): Promise<Todo> {
    return this.todoService.findOneById(todoId);
  }

  @Query(() => [Todo])
  public async todos(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Mutation(() => Todo)
  public async createTodo(@Args() { data }: CreateTodoArgs): Promise<Todo> {
    return this.todoService.create(data);
  }
}
