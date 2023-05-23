import { UseFilters, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import _ from 'lodash';

import { AuthUser } from './auth.interface';
import { AuthService } from './auth.service';
import { SigninCommand } from './commands/signin.command';
import { SignupCommand } from './commands/signup.command';
import { SigninArgs } from './dto/signin.args';
import { SignupArgs } from './dto/signup.args';
import { Auth } from './schemas/auth.schema';
import { ReqUser } from '../../decorators/user.decorator';
import { GqlResolverExceptionsFilter } from '../../filters/gql-resolver-excepion.filter';
import { GqlRefreshAuthGuard } from '../../guards/gql-refresh-auth.guard';

@UseFilters(GqlResolverExceptionsFilter)
@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private commandBus: CommandBus,
  ) {}

  @Mutation(() => Auth)
  public async signin(
    @Args() { data }: SigninArgs,
    @Context() ctx: any,
  ): Promise<Auth> {
    const tokens = await this.commandBus.execute<SigninCommand, Auth>(
      new SigninCommand(data),
    );

    this.setAuthCookies(tokens, ctx);

    return tokens;
  }

  @Mutation(() => Auth)
  public async signup(
    @Args() { data }: SignupArgs,
    @Context() ctx: any,
  ): Promise<Auth> {
    const tokens = await this.commandBus.execute<SignupCommand, Auth>(
      new SignupCommand(data),
    );

    this.setAuthCookies(tokens, ctx);

    return tokens;
  }

  @UseGuards(GqlRefreshAuthGuard)
  @Query(() => Auth)
  public async refreshJwt(
    @ReqUser() user: AuthUser,
    @Context() ctx: any,
  ): Promise<Auth> {
    const tokens = await this.authService.refreshJwt(user);

    this.setAuthCookies(tokens, ctx);

    return tokens;
  }

  private setAuthCookies({ accessToken, refreshToken }: Auth, ctx: any): void {
    const res: Response = _.get(ctx, 'req.res');

    const cookieOpts = {
      httpOnly: true,
      maxAge: 30 * 60 * 60 * 24 * 1000,
    };

    if (res) {
      res.cookie('access_token', accessToken, cookieOpts);
      res.cookie('refresh_token', refreshToken, cookieOpts);
    }
  }
}
