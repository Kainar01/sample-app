import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

import { AuthUser } from '../core/auth/auth.interface';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /**
   * Returns whether the request is authorized to activate the handler
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check context with AuthGuard
    if (!(await super.canActivate(context))) {
      return false;
    }

    const ctx = GqlExecutionContext.create(context);
    const currentUser: AuthUser = ctx.getContext().req.user;
    const handler = context.getHandler();

    return this.canActivateRoles(handler, currentUser);
  }

  // Checks if any of the required roles exist in the user role list
  private matchRoles(rolesToMatch: string[], userRoles: string[]): boolean {
    return rolesToMatch.some((r) => userRoles.includes(r));
  }

  // This method is required for the interface - do not delete it.
  public getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  /* eslint-disable-next-line @typescript-eslint/ban-types */
  private getExpectedRoles(handler: Function): string[] {
    return this.reflector.get<string[]>('roles', handler);
  }

  /* eslint-disable-next-line @typescript-eslint/ban-types */
  public canActivateRoles(handler: Function, currentUser: AuthUser): boolean {
    const expectedRoles = this.getExpectedRoles(handler);

    if (expectedRoles) {
      const currentUserRoles = currentUser.roles.map((r) => r.role);
      return this.matchRoles(expectedRoles, currentUserRoles);
    }

    return true;
  }
}
