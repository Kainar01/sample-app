import { get } from 'env-var';

export class SendGridConfig {
  public static readonly API_KEY_NAME: string = 'apikey';

  public static readonly FROM_ADDRESS: string = get('SENDGRID_FROM_ADDRESS')
    .required()
    .asString();

  public static readonly SECURE: boolean = get('SENDGRID_SECURE')
    .default('true')
    .asBool();

  public static readonly HOST: string = get('SENDGRID_HOST')
    .default('smtp.sendgrid.net')
    .asString();

  public static readonly PORT: number = get('SENDGRID_PORT')
    .default(465)
    .asInt();

  public static readonly API_KEY: string = get('SENDGRID_API_KEY')
    .required()
    .asString();
}
