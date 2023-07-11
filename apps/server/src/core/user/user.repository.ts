import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { KyselyService } from '../../kysely';

@Injectable()
export class UserRepository {
  constructor(private readonly kysely: KyselyService) {}

  public async getUserCountByRole(): Promise<Record<Role, number>> {
    const userRoleCount = await this.kysely
      .selectFrom('User')
      .innerJoin('UserRole', 'UserRole.userId', 'User.id')
      .select([
        'UserRole.role',
        (qb) => qb.fn.count<number>('User.id').as('count'),
      ])
      .groupBy('UserRole.role')
      .execute();

    return userRoleCount.reduce(
      (roleAggregate: Record<Role, number>, roleCount) => {
        // eslint-disable-next-line no-param-reassign
        roleAggregate[roleCount.role] = roleCount.count;
        return roleAggregate;
      },
      <Record<Role, number>>{},
    );
  }
}
