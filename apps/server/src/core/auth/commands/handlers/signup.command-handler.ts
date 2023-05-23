import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { UserService } from '../../../user/user.service';
import { AuthService } from '../../auth.service';
import { UserSignedUpEvent } from '../../events/user-signed-up.event';
import { PasswordService } from '../../password.service';
import { Auth } from '../../schemas/auth.schema';
import { SignupCommand } from '../signup.command';

@CommandHandler(SignupCommand)
export class SignupCommandHandler implements ICommandHandler<SignupCommand> {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: SignupCommand): Promise<Auth> {
    const { password, firstName, lastName, email } = command.input;

    const passwordHash = await this.passwordService.hashPassword(password);

    const user = await this.userService.create({
      email,
      firstName,
      lastName,
      password: passwordHash,
    });

    this.eventBus.publish(new UserSignedUpEvent(user));

    return this.authService.prepareToken(user);
  }
}
