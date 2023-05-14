import { AbilityBuilder, createMongoAbility, subject } from '@casl/ability';
import { User } from '@prisma/client';

import { UserAbility } from './user.ability';
import { AuthUser } from '../../auth/auth.interface';
import { Role } from '../../user/enums/role.enum';
import { AppAbility } from '../permission.interface';

const ADMIN_USER: AuthUser = {
  userId: 1,
  password: '',
  isAdmin: true,
  roles: [
    {
      id: 1,
      userId: 1,
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

const REGULAR_USER: AuthUser = {
  userId: 2,
  password: '',
  isAdmin: false,
  roles: [],
};

const USER_SUBJECTS = {
  user: {
    id: REGULAR_USER.userId,
    deletedAt: null,
  },
  admin: {
    id: ADMIN_USER.userId,
    deletedAt: null,
  },
};
function createAbility(user: AuthUser): AppAbility {
  const subjectAbility = new UserAbility();

  const abilityBuilder = new AbilityBuilder<any>(createMongoAbility);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  subjectAbility.define(abilityBuilder, user);

  return abilityBuilder.build();
}

describe('UserAbility', () => {
  const adminAbility = createAbility(ADMIN_USER);
  const userAbility = createAbility(REGULAR_USER);

  const adminSubject = subject('user', USER_SUBJECTS.admin);
  const userSubject = subject('user', USER_SUBJECTS.user);

  it('Should allow admin manage users', () => {
    expect(adminAbility.can('read', userSubject)).toBe(true);
    expect(adminAbility.can('delete', userSubject)).toBe(true);
    expect(adminAbility.can('update', userSubject)).toBe(true);
    expect(adminAbility.can('manage', userSubject)).toBe(true);
  });

  it('Should allow regular user manage itself', () => {
    expect(userAbility.can('read', userSubject)).toBe(true);
    expect(userAbility.can('delete', userSubject)).toBe(true);
    expect(userAbility.can('update', userSubject)).toBe(true);

    expect(userAbility.can('read', adminSubject)).toBe(false);
    expect(userAbility.can('delete', adminSubject)).toBe(false);
    expect(userAbility.can('update', adminSubject)).toBe(false);
  });
});
