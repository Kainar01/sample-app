/* eslint-disable @typescript-eslint/unbound-method */
import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { TechbridgeLogger } from '@techbridge/util/nestjs/logger';
import { ApolloError } from 'apollo-server-errors';
import { Request } from 'express';

import { ServerConfig } from '../config/server.config';
import { ApplicationError } from '../errors/application.error';
import { InternalServerError } from '../errors/internal-server.error';
import { UniqueKeyError } from '../errors/unique-key.error';

export type RequestData = {
  query: string;
  hostname: string;
  ip: string;
  userId: string;
};

export const PRISMA_CODE_UNIQUE_KEY_VIOLATION = 'P2002';

export function createRequestData(req: Request): RequestData {
  const user = <{ id: string } | null>req.user;
  return {
    query: req.body?.query,
    hostname: req.hostname,
    ip: req.ip,
    userId: user?.id,
  };
}

@Catch()
export class GqlResolverExceptionsFilter implements GqlExceptionFilter {
  constructor(private readonly logger: TechbridgeLogger) {}

  public catch(error: Error, host: ArgumentsHost): Error {
    const requestData = this.prepareRequestData(host);

    const knownError = this.getKnownClientError(error);

    if (knownError) {
      this.logger.info(knownError.message, { requestData });
      return knownError;
    }

    this.logger.error(error.message, { ...error, requestData });
    const serverError =
      ServerConfig.nodeEnv === 'production'
        ? new InternalServerError()
        : new ApolloError(error.message);

    return serverError;
  }

  private getKnownClientError(error: Error): Error | null {
    const knownErrorMatchers = [
      this.prismaClientError,
      this.applicationClientError,
      this.httpClientError,
    ];

    for (const matchError of knownErrorMatchers) {
      const clientError = matchError(error);

      if (clientError) {
        return clientError;
      }
    }

    return null;
  }

  private prismaClientError(error: Error): UniqueKeyError | null {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PRISMA_CODE_UNIQUE_KEY_VIOLATION
    ) {
      const fields = (<{ target: string[] }>error.meta).target;
      return new UniqueKeyError(fields);
    }

    return null;
  }

  private applicationClientError(error: Error): ApolloError | null {
    if (error instanceof ApplicationError) {
      return new ApolloError(error.message);
    }

    return null;
  }

  private httpClientError(error: Error): HttpException | null {
    if (error instanceof HttpException) {
      return error;
    }

    return null;
  }

  private prepareRequestData(host: ArgumentsHost): RequestData | null {
    const { req } = GqlArgumentsHost.create(host).getContext();
    return req ? createRequestData(<Request>req) : null;
  }
}
