import { subject as caslSubject } from '@casl/ability';
import { ForbiddenError } from '@nestjs/apollo';

import * as utils from './permission.utils';
import { AuthUser } from '../auth/auth.interface';
import { Role } from '../user/enums/role.enum';

const ADMIN_USER: AuthUser = {
  userId: 1,
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

describe('authorize', () => {
  let spyOnParseAction: jest.SpyInstance;
  let spyOnGetCtxAbility: jest.SpyInstance;

  beforeEach(() => {
    spyOnParseAction = jest.spyOn(utils, 'parseSubjectAction');
    spyOnGetCtxAbility = jest.spyOn(utils, 'getCtxAbility');
  });

  afterEach(() => {
    spyOnParseAction.mockRestore();
    spyOnGetCtxAbility.mockRestore();
  });

  it('parseSubjectAction should return parsed subject and action', () => {
    const [subject, action] = utils.parseSubjectAction('user.delete');

    expect(subject).toEqual('user');
    expect(action).toEqual('delete');
  });

  it('authorize should call parseSubjectAction with subjectAction', () => {
    const mockCan = jest.fn(() => true);
    spyOnGetCtxAbility.mockReturnValue({ can: mockCan });

    const subjectAction = 'user.delete';

    // parse action should return parsed subject.action
    const expectedParseActionResult = ['user', 'delete'];

    utils.authorize(REGULAR_USER, subjectAction, USER_SUBJECTS.user);

    expect(spyOnParseAction).toHaveBeenCalledWith(subjectAction);
    expect(spyOnParseAction.mock.results[0].value).toEqual(
      expectedParseActionResult,
    );
  });

  it('should call ability.can with parsed action and casl subject', () => {
    const mockCan = jest.fn(() => true);
    spyOnGetCtxAbility.mockReturnValue({ can: mockCan });

    utils.authorize(REGULAR_USER, 'user.delete', USER_SUBJECTS.user);

    expect(mockCan).toHaveBeenCalledWith(
      'delete',
      caslSubject('user', USER_SUBJECTS.user),
    );
  });

  it('should throw error when not allowed', () => {
    const mockCan = jest.fn(() => false);
    spyOnGetCtxAbility.mockReturnValue({ can: mockCan });

    expect(() => {
      utils.authorize(REGULAR_USER, 'user.delete', USER_SUBJECTS.user);
    }).toThrowError(ForbiddenError);
  });
});
