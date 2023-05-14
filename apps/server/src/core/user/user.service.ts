import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { UpdateUserInput } from './dto/update-user.input';
import { User } from './schemas/user.schema';
import { PrismaService } from '../../prisma';
import { AuthUser } from '../auth/auth.interface';
import { authorize } from '../permission/permission.utils';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.user.update({ where: { id: user.id }, data });
  }
}
