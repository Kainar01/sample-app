import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { AppAbility } from './permission.interface';
import { policies } from './policies';
import { AuthUser } from '../auth/auth.interface';

export const Actions = <const>{
  user: ['read', 'update', 'delete', 'suspend'],
  todo: ['read', 'update', 'delete', 'copy'],
};

export function createAbilityForUser(user: AuthUser): AppAbility {
  const abilityBuilder = new AbilityBuilder<any>(createMongoAbility);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  policies.forEach((policy) => policy.define(user, abilityBuilder));

  return abilityBuilder.build();
}

@Injectable()
export class CaslAbilityFactory {
  public createAbilityForUser(user: AuthUser): AppAbility {
    return createAbilityForUser(user);
  }
}
