import { UseFilters, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { UpdateUserArgs } from './dto/update-user.args';
import { UserRole } from './schemas/user-role.schema';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { ReqUser } from '../../decorators/user.decorator';
import { GqlResolverExceptionsFilter } from '../../filters/gql-resolver-excepion.filter';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { AuthUser } from '../auth/auth.interface';

@UseFilters(GqlResolverExceptionsFilter)
@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { nullable: true })
  public async find(@ReqUser() authUser: AuthUser): Promise<User> {
    return this.userService.find(authUser, authUser.userId);
  }

  @ResolveField(() => [UserRole])
  public async userRoles(@Parent() user: User): Promise<UserRole[]> {
    return this.userService.findUserRoles(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  public async update(
    @Args() { data }: UpdateUserArgs,
    @ReqUser() currentUser: AuthUser,
  ): Promise<User> {
    return this.userService.update(currentUser, data);
  }
}
