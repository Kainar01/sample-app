import { ArgsType, Field } from '@nestjs/graphql';

import { SigninInput } from './singin.input';

@ArgsType()
export class SigninArgs {
  @Field(() => SigninInput, { nullable: false })
  public data: SigninInput;
}
