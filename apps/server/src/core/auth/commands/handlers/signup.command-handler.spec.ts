import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';

import { SignupCommandHandler } from './signup.command-handler';
import { UserService } from '../../../user/user.service';
import { AuthService } from '../../auth.service';
import { UserSignedUpEvent } from '../../events/user-signed-up.event';
import { PasswordService } from '../../password.service';
import { Auth } from '../../schemas/auth.schema';
import { SignupCommand } from '../signup.command';

const mockPasswordHash = 'HASHED_PASSWORD';

const mockSignupUser: User = {
  id: 3,
  email: 'james.bond@example.com',
  firstName: 'James',
  lastName: 'Bond',
  password: mockPasswordHash,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockJwt: Auth = {
  accessToken: 'token',
  refreshToken: 'token',
};

describe('SignupCommandHandler', () => {
  let handler: SignupCommandHandler;
  let passwordService: PasswordService;
  let userService: UserService;
  let authService: AuthService;
  let eventBus: EventBus;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SignupCommandHandler,
        {
          provide: PasswordService,
          useValue: { hashPassword: jest.fn() },
        },
        {
          provide: UserService,
          useValue: { create: jest.fn() },
        },
        {
          provide: AuthService,
          useValue: { prepareToken: jest.fn() },
        },
        {
          provide: EventBus,
          useValue: { publish: jest.fn() },
        },
      ],
    }).compile();

    handler = moduleRef.get<SignupCommandHandler>(SignupCommandHandler);
    passwordService = moduleRef.get<PasswordService>(PasswordService);
    userService = moduleRef.get<UserService>(UserService);
    authService = moduleRef.get<AuthService>(AuthService);
    eventBus = moduleRef.get<EventBus>(EventBus);
  });

  it('should create user, publish event and prepare token', async () => {
    const command = new SignupCommand({
      email: mockSignupUser.email,
      firstName: mockSignupUser.firstName,
      lastName: mockSignupUser.lastName,
      password: 'password',
    });

    jest
      .spyOn(passwordService, 'hashPassword')
      .mockResolvedValueOnce(mockPasswordHash);

    jest.spyOn(userService, 'create').mockResolvedValueOnce(mockSignupUser);

    jest.spyOn(authService, 'prepareToken').mockResolvedValueOnce(mockJwt);

    const result = await handler.execute(command);

    expect(passwordService.hashPassword).toHaveBeenCalledWith(
      command.input.password,
    );

    expect(userService.create).toHaveBeenCalledWith({
      ...command.input,
      password: mockPasswordHash,
    });

    expect(eventBus.publish).toHaveBeenCalledWith(
      new UserSignedUpEvent(mockSignupUser),
    );

    expect(authService.prepareToken).toHaveBeenCalledWith(mockSignupUser);

    expect(result).toEqual(mockJwt);
  });
});
