import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class Todo {
  @ApiProperty()
  @Field(() => Int, {
    nullable: false,
  })
  public id!: number;

  @ApiProperty()
  @Field(() => String, {
    nullable: false,
  })
  public title!: string;

  @ApiProperty({ nullable: true })
  @Field(() => String, {
    nullable: true,
  })
  public description!: string | null;

  @ApiProperty()
  @Field(() => Date, {
    nullable: false,
  })
  public createdAt!: Date;

  @ApiProperty()
  @Field(() => Date, {
    nullable: false,
  })
  public updatedAt!: Date;
}
