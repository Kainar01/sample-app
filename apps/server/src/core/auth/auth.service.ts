import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';

import { AuthUser, JWTPayload } from './auth.interface';
import { RedisAuthService } from './redis-auth.service';
import { Auth } from './schemas/auth.schema';
import { AuthConfig } from '../../config/auth.config';
import { PrismaService } from '../../prisma';
import { Role } from '../user/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisAuthService: RedisAuthService,
  ) {}

  public async getCachedUser(userId: number): Promise<AuthUser | null> {
    const cachedUser = await this.redisAuthService.getUser(userId);

    if (!cachedUser) {
      const user = await this.getAuthUser(userId);

      await this.redisAuthService.setUser(user);

      return user;
    }

    return cachedUser;
  }

  public async getAuthUser(userId: number): Promise<AuthUser | null> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      include: { userRoles: true },
    });

    if (user) {
      return this.mapUserToAuthUser(user);
    }

    return null;
  }

  public async refreshJwt(authUser: AuthUser): Promise<Auth> {
    const user = await this.prisma.user.findFirst({
      where: { id: authUser.userId },
      include: { userRoles: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.prepareToken(user);
  }

  /**
   * Creates an API token from given user
   * @param user to create token for
   * @returns new JWT token
   */
  public async prepareToken(user: User): Promise<Auth> {
    const payload: JWTPayload = {
      userId: user.id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: AuthConfig.JWT_ACCESS_SECRET,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: AuthConfig.JWT_REFRESH_SECRET,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private mapUserToAuthUser(user: User & { userRoles: UserRole[] }): AuthUser {
    const isAdmin = user.userRoles.some(({ role }) => role === Role.ADMIN);
    return {
      userId: user.id,
      isAdmin,
      roles: user.userRoles,
    };
  }
}
