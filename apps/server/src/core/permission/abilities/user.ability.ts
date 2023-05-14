import { User } from '@prisma/client';

import { BaseSubjectAbility } from './base.ability';
import { AuthUser } from '../../auth/auth.interface';
import { SubjectAbility } from '../permission.interface';

export class UserAbility extends BaseSubjectAbility<'user', User> {
  public define(
    abilityBuilder: SubjectAbility<'user', User>,
    user: AuthUser,
  ): void {
    if (user.isAdmin) {
      this.defineForAdmin(abilityBuilder);
    } else {
      this.defineForEveryone(abilityBuilder, user);
    }
  }

  private defineForEveryone(
    { can }: SubjectAbility<'user', User>,
    user: AuthUser,
  ): void {
    can(['read', 'update', 'delete'], 'user', {
      id: user.userId,
      deletedAt: null,
    });
  }

  private defineForAdmin({ can }: SubjectAbility<'user', User>): void {
    can('manage', 'user');
  }
}
