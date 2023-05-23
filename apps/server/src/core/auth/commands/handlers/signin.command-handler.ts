import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PrismaService } from '../../../../prisma';
import { AuthService } from '../../auth.service';
import { PasswordService } from '../../password.service';
import { Auth } from '../../schemas/auth.schema';
import { SigninCommand } from '../signin.command';

@CommandHandler(SigninCommand)
export class SigninCommandHandler implements ICommandHandler<SigninCommand> {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  public async execute(command: SigninCommand): Promise<Auth> {
    const { password, email } = command.input;

    const user = await this.prisma.user.findFirst({
      where: { email },
      include: { userRoles: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('Account is deleted');
    }

    const isPasswordValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.authService.prepareToken(user);
  }
}
