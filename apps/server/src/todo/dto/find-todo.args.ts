import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindTodoArgs {
  @Field(() => Int, { nullable: false })
  public todoId!: number;
}
