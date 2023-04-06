import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpException, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import {
  GraphqlInterceptor,
  SentryInterceptor,
  SentryModule,
} from '@ntegral/nestjs-sentry';

import { GraphQLConfig } from './config/graphql.config';
import { SentryConfig } from './config/sentry.config';
import { ServerConfig } from './config/server.config';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    SentryModule.forRoot({
      dsn: SentryConfig.dsn,
      environment: ServerConfig.nodeEnv,
      logLevels: ['debug'], // based on sentry.io loglevel //
    }),
    TodoModule,
    // Initialize graphql after all application modules, otherwise the schema won't be generated
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      ...GraphQLConfig,
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () =>
        new SentryInterceptor({
          filters: [
            {
              type: HttpException,
              filter: (exception: HttpException) => exception.getStatus() > 500,
            },
          ],
        }),
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new GraphqlInterceptor(),
    },
  ],
})
export class AppModule {}
