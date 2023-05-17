import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { UserRole } from '@prisma/client';

import { UpdateUserInput } from './dto/update-user.input';
import { UserUpdatedEvent } from './events/user-updated.event';
import { User } from './schemas/user.schema';
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

    authorize(currentUser, 'user.delete', user);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data,
    });

    this.eventBus.publish(new UserUpdatedEvent(user.id));

    return updatedUser;
  }
}
