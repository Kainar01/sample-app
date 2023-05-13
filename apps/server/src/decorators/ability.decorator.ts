import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { getUser } from './user.decorator';
import { createAbilityForUser } from '../core/permission/casl.factory';

export const Ability = createParamDecorator((_data, ctx: ExecutionContext) => {
  const user = getUser(ctx);

  if (!user) {
    throw new Error(
      "Can't get user from context. Make sure auth guard is setup",
    );
  }

  return createAbilityForUser(user);
});
