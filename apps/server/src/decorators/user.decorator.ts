import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AuthUser } from '../core/auth/auth.interface';

export function getUser(executionContext: ExecutionContext): AuthUser {
  const gqlExecutionContext = GqlExecutionContext.create(executionContext);
  return gqlExecutionContext.getContext().req.user;
}

export const ReqUser = createParamDecorator((_data, ctx: ExecutionContext) =>
  getUser(ctx),
);
