import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { User, UserRole } from '@prisma/client';

import { AuthUser } from './auth.interface';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup.input';
import { SigninInput } from './dto/singin.input';
import { PasswordService } from './password.service';
import { RedisAuthService } from './redis-auth.service';
import { Auth } from './schemas/auth.schema';
import { PrismaService } from '../../prisma';
import { UserService } from '../user/user.service';

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

const mockDeletedUser: User & { userRoles: UserRole[] } = {
  id: 2,
  email: 'john.doe@example.com',
  password: 'password2',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
  userRoles: [],
};

const mockAuthUser: AuthUser = {
  userId: 1,
  isAdmin: false,
  roles: [],
};

const mockJwt: Auth = {
  accessToken: 'token',
  refreshToken: 'token',
};

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let prismaService: PrismaService;
  let passwordService: PasswordService;
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
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('token') },
        },
        {
          provide: PasswordService,
          useValue: {
            validatePassword: jest.fn(
              (password, hashedPassword) => password === hashedPassword,
            ),
            hashPassword: jest.fn((password) => password),
          },
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
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    userService = moduleRef.get<UserService>(UserService);
    passwordService = moduleRef.get<PasswordService>(PasswordService);
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

  describe('signin', () => {
    const mockSigninInput: SigninInput = {
      email: mockDeletedUser.email,
      password: mockDeletedUser.password,
    };

    it('should throw error when user does not exist by email', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(null);
      passwordService.validatePassword = jest.fn().mockResolvedValue(true);

      await expect(authService.signin(mockSigninInput)).rejects.toThrow(
        'Invalid email',
      );
    });

    it('should throw error when password does not match', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(mockUser);
      passwordService.validatePassword = jest.fn().mockResolvedValue(false);

      await expect(authService.signin(mockSigninInput)).rejects.toThrow(
        'Invalid password',
      );
    });

    it('should throw error when user is deleted', async () => {
      prismaService.user.findFirst = jest
        .fn()
        .mockResolvedValue(mockDeletedUser);
      passwordService.validatePassword = jest.fn().mockResolvedValue(true);

      await expect(authService.signin(mockSigninInput)).rejects.toThrow(
        'Account is deleted',
      );
    });

    it('should return jwt token when everything ok', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(mockUser);
      passwordService.validatePassword = jest.fn().mockResolvedValue(true);
      authService.prepareToken = jest.fn().mockResolvedValue(mockJwt);

      const jwt = await authService.signin(mockSigninInput);

      expect(authService.prepareToken).toBeCalledWith(mockUser);

      expect(jwt).toEqual(mockJwt);
    });
  });

  describe('signup', () => {
    const mockHashedPassword = 'hashedPassword';

    const mockSignupUser: User = {
      id: 3,
      email: 'james.bond@example.com',
      firstName: 'James',
      lastName: 'Bond',
      password: mockHashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const mockSignupInput: SignupInput = {
      email: mockSignupUser.email,
      firstName: mockSignupUser.firstName,
      lastName: mockSignupUser.lastName,
      password: 'password',
    };

    it('should call create method with hashed password', async () => {
      const userCreateMock = jest.fn().mockResolvedValue(mockSignupUser);
      userService.create = userCreateMock;
      passwordService.hashPassword = jest
        .fn()
        .mockResolvedValue(mockHashedPassword);

      await authService.signup(mockSignupInput);

      expect(passwordService.hashPassword).toBeCalledWith(
        mockSignupInput.password,
      );
      // check that `userService.create` method is called with hashed password
      expect(userCreateMock.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          password: mockHashedPassword,
        }),
      );
    });

    it('should return jwt token', async () => {
      const userCreateMock = jest.fn().mockResolvedValue(mockSignupUser);
      userService.create = userCreateMock;
      passwordService.hashPassword = jest
        .fn()
        .mockResolvedValue(mockHashedPassword);
      authService.prepareToken = jest.fn().mockResolvedValue(mockJwt);

      await authService.signup(mockSignupInput);

      expect(passwordService.hashPassword).toBeCalledWith(
        mockSignupInput.password,
      );

      expect(authService.prepareToken).toBeCalledWith(mockSignupUser);
    });
  });
});
