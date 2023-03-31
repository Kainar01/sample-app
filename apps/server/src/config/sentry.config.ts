import { get } from 'env-var';

export class SentryConfig {
  public static readonly dsn: string = get('SENTRY_DSN').required().asString();
}
