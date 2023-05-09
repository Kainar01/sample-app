import { Field, ObjectType } from '@nestjs/graphql';

import { UserRole } from './user-role.schema';

@ObjectType()
export class User {
  @Field(() => Number, {
    nullable: false,
  })
  public id: number;

  @Field(() => String, {
    nullable: false,
  })
  public email: string;

  @Field(() => String, {
    nullable: true,
  })
  public firstName: string;

  @Field(() => String, {
    nullable: true,
  })
  public lastName: string;

  @Field(() => Date, {
    nullable: false,
  })
  public createdAt: Date;

  @Field(() => Date, {
    nullable: false,
  })
  public updatedAt: Date;

  @Field(() => Date, {
    nullable: true,
  })
  public deletedAt: Date;

  @Field(() => [UserRole], {
    nullable: true,
  })
  public userRoles?: UserRole[] | null;
}
