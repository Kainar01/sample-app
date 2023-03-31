import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { DatabaseConfig } from '../config/database.config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasources: {
        db: { url: DatabaseConfig.databaseUrl },
      },
    });
  }

  public async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
    } catch (error) {
      // TODO: use logging plugin (winston, etc.)
      console.error('Prisma connection error', error);
      throw error;
    }
  }

  public async enableShutdownHooks(app: INestApplication): Promise<void> {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
