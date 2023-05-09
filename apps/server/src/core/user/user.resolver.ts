import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { UserRole } from './schemas/user-role.schema';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { ReqUser } from '../../decorators/user.decorator';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { AuthUser } from '../auth/auth.interface';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { nullable: true })
  public async getUser(@ReqUser() authUser: AuthUser): Promise<User> {
    return this.userService.findUser(authUser.userId);
  }

  @ResolveField(() => [UserRole])
  public async getUserRoles(@Parent() user: User): Promise<UserRole[]> {
    return this.userService.findUserRoles(user.id);
  }
}
