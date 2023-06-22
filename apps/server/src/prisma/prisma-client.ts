import { INestApplication } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { RequestContextService } from '../services/request-context.service';

const extendedPrismaClient = (client: PrismaClient) =>
  client.$extends({
    client: {
      // async onModuleInit() {
      // Uncomment this to establish a connection on startup, this is generally not necessary
      // https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management#connect
      // await Prisma.getExtensionContext(this).$connect();
      // },
      enableShutdownHooks(app: INestApplication) {
        Prisma.getExtensionContext(client).$on('beforeExit', async () => {
          await app.close();
        });
      },
      async $transaction<T>(handler: () => Promise<T>) {
        return Prisma.getExtensionContext(client).$transaction(async (tx) => {
          if (!RequestContextService.getPrismaTransaction()) {
            RequestContextService.setPrismaTransaction(tx);
          }

          try {
            const result = await handler();
            console.debug(`[${new Date()}] transaction committed`);
            return result;
          } catch (e) {
            console.debug(`[${new Date()}] transaction aborted`);
            throw e;
          } finally {
            RequestContextService.cleanPrismaTransaction();
          }
        });
      },
    },
    query: {
      $allModels: {
        $allOperations({ model, operation, args, query }) {
          const tx = RequestContextService.getPrismaTransaction();

          if (tx) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            return tx[model][operation](args);
          }

          return query(args);
        },
      },
    },
  });

export type IExtendedPrismaClient = new (
  options?: Prisma.PrismaClientOptions,
) => ReturnType<typeof extendedPrismaClient>;

export const ExtendedPrismaClient = <IExtendedPrismaClient> class {
  constructor(options?: Prisma.PrismaClientOptions) {
    const client = new PrismaClient(options);

    // eslint-disable-next-line no-constructor-return
    return extendedPrismaClient(client);
  }
};
