import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @Field(() => String, {
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  public title!: string;

  @Field(() => String, {
    nullable: true,
  })
  @IsString()
  @IsOptional()
  public description!: string | null;
}
