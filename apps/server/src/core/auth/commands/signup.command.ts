import { ICommand } from '@nestjs/cqrs';

import { SignupInput } from '../dto/signup.input';

export class SignupCommand implements ICommand {
  constructor(public readonly input: SignupInput) {}
}
