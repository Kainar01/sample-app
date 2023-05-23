import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { User, UserRole } from '@prisma/client';

import { AuthUser } from './auth.interface';
import { AuthService } from './auth.service';
import { RedisAuthService } from './redis-auth.service';
import { PrismaService } from '../../prisma';

const mockUser: User & { userRoles: UserRole[] } = {
  id: 1,
  email: 'alice.bob@example.com',
  password: 'password1',
  firstName: 'Alice',
  lastName: 'Bob',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  userRoles: [],
};

const mockAuthUser: AuthUser = {
  userId: 1,
  isAdmin: false,
  roles: [],
};

describe('AuthService', () => {
  let authService: AuthService;
  let redisAuthService: RedisAuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: { findFirst: jest.fn().mockResolvedValue(mockUser) },
          },
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('token') },
        },
        {
          provide: RedisAuthService,
          useValue: {
            getUser: jest.fn(),
            setUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    redisAuthService = moduleRef.get<RedisAuthService>(RedisAuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('getAuthUser', () => {
    it('should get user and map to auth user', async () => {
      const authServiceProto = Object.getPrototypeOf(authService);
      // using prototype to access private method of `AuthService`
      const spyOnMapUserToAuthUser = jest.spyOn(
        authServiceProto,
        'mapUserToAuthUser',
      );

      spyOnMapUserToAuthUser.mockReturnValue(mockAuthUser);

      const authUser = await authService.getAuthUser(mockUser.id);

      expect(spyOnMapUserToAuthUser).toBeCalledWith(mockUser);

      expect(authUser).toEqual(mockAuthUser);
    });
  });

  describe('getCachedAuthUser', () => {
    it('should call getAuthUser and return its value when user is not cached', async () => {
      redisAuthService.getUser = jest.fn().mockResolvedValue(null);
      authService.getAuthUser = jest.fn().mockReturnValue(mockAuthUser);

      const authUser = await authService.getCachedUser(mockUser.id);

      expect(redisAuthService.getUser).toBeCalledWith(mockUser.id);
      expect(authService.getAuthUser).toBeCalledWith(mockUser.id);

      expect(authUser).toEqual(mockAuthUser);
    });

    it('should set cache when there is no cache for user', async () => {
      redisAuthService.getUser = jest.fn().mockResolvedValue(null);
      authService.getAuthUser = jest.fn().mockReturnValue(mockAuthUser);

      await authService.getCachedUser(mockUser.id);

      expect(redisAuthService.setUser).toBeCalledWith(mockAuthUser);
    });

    it('should not call getUser when there is cache', async () => {
      redisAuthService.getUser = jest.fn().mockResolvedValue(mockAuthUser);
      authService.getAuthUser = jest.fn();

      const authUser = await authService.getCachedUser(mockUser.id);

      expect(authService.getAuthUser).not.toBeCalled();

      expect(authUser).toEqual(mockAuthUser);
    });
  });
});
