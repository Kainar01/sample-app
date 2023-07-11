import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

import { User } from './user.schema';

@ObjectType()
export class UserRole {
  @Field(() => Number, {
    nullable: false,
  })
  public id: number;

  @Field(() => Date, {
    nullable: false,
  })
  public createdAt: Date;

  @Field(() => Date, {
    nullable: false,
  })
  public updatedAt: Date;

  public user?: User;

  @Field(() => Role, {
    nullable: false,
  })
  public role: string;
}

registerEnumType(Role, {
  name: 'Role',
});
