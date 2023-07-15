import { Test } from '@nestjs/testing';
import { User, UserRole } from '@prisma/client';
import { EventBus } from '@techbridge/nestjs/event-bus';

import { UpdateUserInput } from './dto/update-user.input';
import { Role } from './enums/role.enum';
import { UserUpdatedEvent } from './events/user-updated.event';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma';
import { AuthUser } from '../auth/auth.interface';
import * as permissionUtils from '../permission/permission.utils';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let eventBus: EventBus;
  let spyOnAuthorize: jest.SpyInstance;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              update: jest.fn(),
            },
            userRole: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    eventBus = moduleRef.get<EventBus>(EventBus);
    spyOnAuthorize = jest.spyOn(permissionUtils, 'authorize');
    spyOnAuthorize.mockReturnValue(null);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('find', () => {
    it('should find user', async () => {
      const testUser: User = {
        id: 1,
        email: 'alice.bob@example.com',
        password: 'password1',
        firstName: 'Alice',
        lastName: 'Bob',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const currentUser: AuthUser = { userId: 1, isAdmin: false, roles: [] };
      prismaService.user.findFirst = jest.fn().mockResolvedValueOnce(testUser);

      const user = await service.find(currentUser, testUser.id);

      expect(user).toEqual(testUser);

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('findUserRoles', () => {
    it('should find user roles', async () => {
      const testUserRoles: UserRole[] = [
        {
          id: 1,
          userId: 1,
          role: Role.ADMIN,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      prismaService.userRole.findMany = jest
        .fn()
        .mockResolvedValueOnce(testUserRoles);

      const result = await service.findUserRoles(1);

      expect(result).toEqual(testUserRoles);
      expect(prismaService.userRole.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      // Prepare
      const testUser = { id: 1 };
      const currentUser: AuthUser = { userId: 1, isAdmin: false, roles: [] };
      const updateData: UpdateUserInput = { id: 1, firstName: 'John' };

      prismaService.user.findFirst = jest.fn().mockResolvedValueOnce(testUser);
      prismaService.user.update = jest.fn().mockResolvedValueOnce({
        ...testUser,
        ...updateData,
      });

      const updatedUser = await service.update(currentUser, updateData);

      expect(updatedUser).toEqual({ ...testUser, ...updateData });

      expect(eventBus.publish).toHaveBeenCalledWith(new UserUpdatedEvent(1));
    });
  });
});
