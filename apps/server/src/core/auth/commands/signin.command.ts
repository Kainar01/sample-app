import { ICommand } from '@nestjs/cqrs';

import { SigninInput } from '../dto/singin.input';

export class SigninCommand implements ICommand {
  constructor(public readonly input: SigninInput) {}
}
