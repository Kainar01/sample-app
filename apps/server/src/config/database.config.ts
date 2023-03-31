import { get } from 'env-var';

export class DatabaseConfig {
  public static readonly databaseUrl: string = get('DATABASE_URL')
    .required()
    .asString();
}
