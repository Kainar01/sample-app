import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserRole } from '@prisma/client';

import { SigninCommandHandler } from './signin.command-handler';
import { PrismaService } from '../../../../prisma';
import { AuthService } from '../../auth.service';
import { PasswordService } from '../../password.service';
import { Auth } from '../../schemas/auth.schema';
import { SigninCommand } from '../signin.command';

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

const mockJwt: Auth = {
  accessToken: 'token',
  refreshToken: 'token',
};

describe('SigninCommandHandler', () => {
  let handler: SigninCommandHandler;
  let authService: AuthService;
  let passwordService: PasswordService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SigninCommandHandler,
        {
          provide: AuthService,
          useValue: {
            prepareToken: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            validatePassword: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    handler = module.get<SigninCommandHandler>(SigninCommandHandler);
    authService = module.get<AuthService>(AuthService);
    passwordService = module.get<PasswordService>(PasswordService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should throw UnauthorizedException if user not found', async () => {
    const command = new SigninCommand({
      password: 'pass',
      email: 'test@test.com',
    });
    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(undefined);

    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if account is deleted', async () => {
    const command = new SigninCommand({
      password: 'pass',
      email: 'test@test.com',
    });
    jest
      .spyOn(prismaService.user, 'findFirst')
      .mockResolvedValue({ ...mockUser, deletedAt: new Date() });

    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const command = new SigninCommand({
      password: 'pass',
      email: 'test@test.com',
    });

    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);

    jest.spyOn(passwordService, 'validatePassword').mockResolvedValue(false);

    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('should return token if user is found and password is valid', async () => {
    const command = new SigninCommand({
      password: 'pass',
      email: 'test@test.com',
    });

    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);

    jest.spyOn(passwordService, 'validatePassword').mockResolvedValue(true);

    jest.spyOn(authService, 'prepareToken').mockResolvedValue(mockJwt);

    const result = await handler.execute(command);

    expect(result).toBe(mockJwt);
  });
});
