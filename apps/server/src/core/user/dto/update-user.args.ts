import { ArgsType, Field } from '@nestjs/graphql';

import { UpdateUserInput } from './update-user.input';

@ArgsType()
export class UpdateUserArgs {
  @Field(() => UpdateUserInput, { nullable: false })
  public data: UpdateUserInput;
}
