import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Auth {
  @Field({ description: 'JWT Bearer access token', nullable: false })
  public accessToken: string;

  @Field({ description: 'JWT Bearer refresh token', nullable: false })
  public refreshToken: string;
}
