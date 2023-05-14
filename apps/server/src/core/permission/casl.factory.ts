import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { abilities } from './abilities';
import { AppAbility } from './permission.interface';
import { AuthUser } from '../auth/auth.interface';

export function createAbilityForUser(user: AuthUser): AppAbility {
  const abilityBuilder = new AbilityBuilder<any>(createMongoAbility);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  abilities.forEach((ability) => ability.define(abilityBuilder, user));

  return abilityBuilder.build();
}

@Injectable()
export class CaslAbilityFactory {
  public createAbilityForUser(user: AuthUser): AppAbility {
    return createAbilityForUser(user);
  }
}
