import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { User } from './schemas/user.schema';
import { PrismaService } from '../../prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async findUser(userId: number): Promise<User> {
    return this.prisma.user.findFirst({
      where: { id: userId },
    });
  }

  public async findUserRoles(userId: number): Promise<UserRole[]> {
    return this.prisma.userRole.findMany({ where: { userId } });
  }
}
