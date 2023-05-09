import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

import { AuthConfig } from '../../config/auth.config';

@Injectable()
export class PasswordService {
  public async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  public async hashPassword(password: string): Promise<string> {
    return hash(password, AuthConfig.BCRYPT_SALT_ROUNDS);
  }

  public generatePassword(): string {
    return Math.random().toString(36).slice(-8);
  }
}
