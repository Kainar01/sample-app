import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AuthService } from '../../auth.service';
import { Auth } from '../../schemas/auth.schema';
import { SignupCommand } from '../signup.command';

@CommandHandler(SignupCommand)
export class SignupHandler implements ICommandHandler<SignupCommand> {
  constructor(private readonly authService: AuthService) {}

  public async execute(command: SignupCommand): Promise<Auth> {
    const { input } = command;
    return this.authService.signup(input);
  }
}
