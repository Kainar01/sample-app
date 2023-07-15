import { Injectable } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { EventBus } from '@techbridge/nestjs/event-bus';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserCreatedEvent } from './events/user-created.event';
import { UserUpdatedEvent } from './events/user-updated.event';
import { PrismaService } from '../../prisma';
import { AuthUser } from '../auth/auth.interface';
import { authorize } from '../permission/permission.utils';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  public async find(currentUser: AuthUser, userId: number): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    authorize(currentUser, 'user.read', user);

    return user;
  }

  public async findUserRoles(userId: number): Promise<UserRole[]> {
    return this.prisma.userRole.findMany({ where: { userId } });
  }

  public async update(
    currentUser: AuthUser,
    { id, ...data }: UpdateUserInput,
  ): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    authorize(currentUser, 'user.update', user);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data,
    });

    await this.eventBus.publish(new UserUpdatedEvent(user.id));

    return updatedUser;
  }

  public async create(data: CreateUserInput): Promise<User> {
    const user = await this.prisma.user.create({
      data,
    });

    await this.eventBus.publish(new UserCreatedEvent(user));

    return user;
  }
}
