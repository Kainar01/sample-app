/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { ServerConfig } from './config/server.config';
import { SwaggerConfig } from './config/swagger.config';
import { PrismaService } from './prisma';
import {
  swaggerDocumentOptions,
  swaggerPath,
  swaggerSetupOptions,
} from './swagger';

export const APP_ROOT_PATH = __dirname;

function middleware(app: INestApplication): void {
  // CORS
  if (ServerConfig.corsEnable) {
    app.enableCors();
  }

  app.use(cookieParser());
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // set global api prefix
  app.setGlobalPrefix(ServerConfig.apiPrefix);

  if (SwaggerConfig.enabled) {
    const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);
    SwaggerModule.setup(swaggerPath, app, document, swaggerSetupOptions);
  }

  // TODO: handle prisma shutdown
  if (ServerConfig.enableShutdownHooks) {
    app.enableShutdownHooks();
  }

  // middlewares
  middleware(app);

  await app.listen(ServerConfig.port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${ServerConfig.port}/${ServerConfig.apiPrefix}`,
  );
}

(async () => {
  await bootstrap();
})();
