import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class SignupInput {
  @Field({ nullable: false })
  @IsEmail()
  public email: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  @MinLength(8)
  public password: string;

  @Field({ nullable: false })
  public firstName: string;

  @Field({ nullable: false })
  public lastName: string;
}
