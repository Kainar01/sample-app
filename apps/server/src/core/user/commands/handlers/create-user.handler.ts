import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '@prisma/client';

import { UserService } from '../../user.service';
import { CreateUserCommand } from '../create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userService: UserService) {}

  public async execute(command: CreateUserCommand): Promise<User> {
    const { input } = command;
    return this.userService.create(input);
  }
}
