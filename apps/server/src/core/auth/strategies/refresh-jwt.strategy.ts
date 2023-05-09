import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { AuthConfig } from '../../../config/auth.config';
import { AuthUser, JWTPayload } from '../auth.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshJwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: AuthConfig.JWT_REFRESH_SECRET,
    });
  }

  public async validate(payload: JWTPayload): Promise<AuthUser> {
    const user = await this.authService.getAuthUser(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'refresh_token' in req.cookies) {
      return <string>req.cookies.refresh_token;
    }
    return null;
  }
}
