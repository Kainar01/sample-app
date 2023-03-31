import { ArgsType, Field } from '@nestjs/graphql';

import { CreateTodoInput } from './create-todo.input';

@ArgsType()
export class CreateTodoArgs {
  @Field(() => CreateTodoInput, { nullable: false })
  public data!: CreateTodoInput;
}
