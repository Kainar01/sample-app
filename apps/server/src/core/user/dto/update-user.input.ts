import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: false })
  @IsNumber()
  public id: number;

  @Field({ nullable: true })
  @IsEmail()
  public email?: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  @MinLength(8)
  public password?: string;

  @Field({ nullable: true })
  public firstName?: string;

  @Field({ nullable: true })
  public lastName?: string;
}
