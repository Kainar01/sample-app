import { User } from '@prisma/client';

import { AuthUser } from '../../auth/auth.interface';
import { SubjectAbility } from '../permission.interface';

export class UserPolicy {
  public static define(
    user: AuthUser,
    { can }: SubjectAbility<'user', User>,
  ): void {
    can(['read', 'update', 'delete'], 'user', {
      id: user.userId,
      deletedAt: null,
    });
  }
}
