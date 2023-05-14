import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';

import { AuthUser, JWTPayload } from './auth.interface';
import { SignupInput } from './dto/signup.input';
import { SigninInput } from './dto/singin.input';
import { PasswordService } from './password.service';
import { Auth } from './schemas/auth.schema';
import { AuthConfig } from '../../config/auth.config';
import { PrismaService } from '../../prisma';
import { Role } from '../user/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

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

  public async signin(payload: SigninInput): Promise<Auth> {
    const user = await this.prisma.user.findFirst({
      where: { email: payload.email },
      include: { userRoles: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordValid = await this.passwordService.validatePassword(
      payload.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('Account is deleted');
    }

    return this.prepareToken(user);
  }

  public async signup(payload: SignupInput): Promise<Auth> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password,
    );

    const user = await this.prisma.user.create({
      data: {
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        password: hashedPassword,
      },
    });

    return this.prepareToken(user);
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
      password: user.password,
      isAdmin,
      roles: user.userRoles,
    };
  }
}
