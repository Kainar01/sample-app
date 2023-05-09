import { Field, ObjectType } from '@nestjs/graphql';

import { User } from './user.schema';
import { Role } from '../enums/role.enum';

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
