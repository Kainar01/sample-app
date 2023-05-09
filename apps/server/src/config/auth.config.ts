import { get } from 'env-var';

export class AuthConfig {
  public static readonly JWT_ACCESS_SECRET: string = get('JWT_ACCESS_SECRET')
    .default('change-in-production')
    .asString();

  public static readonly JWT_REFRESH_SECRET: string = get('JWT_REFRESH_SECRET')
    .default('change-in-production')
    .asString();

  public static readonly BCRYPT_SALT_ROUNDS: number = get('BCRYPT_SALT_ROUNDS')
    .default(10)
    .asInt();
}
