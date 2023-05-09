import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class SigninInput {
  @Field({ nullable: false })
  @IsEmail()
  public email: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  @MinLength(8)
  public password: string;
}
