import { INestApplication } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { RequestContextService } from '../services/request-context.service';

/**
 * This function creates a new transaction if there is none in the current context.
 * It will commit the transaction if it completes successfully, or abort if an error is encountered.
 * @param {PrismaClient} client - The PrismaClient instance.
 * @param {Function} handler - The function that will be performed within the transaction.
 * @return {Promise<T>} - The result of the transaction.
 */
async function performTransaction<T>(
  client: PrismaClient,
  handler: () => Promise<T>,
) {
  return client.$transaction(async (tx) => {
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
}

function createExtendedPrismaClient(options?: Prisma.PrismaClientOptions) {
  const client = new PrismaClient(options);

  return client.$extends({
    client: {
      // async onModuleInit() {
      // Uncomment this to establish a connection on startup, this is generally not necessary
      // https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management#connect
      // await Prisma.getExtensionContext(this).$connect();
      // },
      enableShutdownHooks(app: INestApplication) {
        client.$on('beforeExit', async () => {
          await app.close();
        });
      },
      async $transaction<T>(handler: () => Promise<T>) {
        return performTransaction(client, handler);
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
}

export type IExtendedPrismaClient = new (
  options?: Prisma.PrismaClientOptions,
) => ReturnType<typeof createExtendedPrismaClient>;

export const ExtendedPrismaClient = <IExtendedPrismaClient> class {
  constructor(options?: Prisma.PrismaClientOptions) {
    // eslint-disable-next-line no-constructor-return
    return createExtendedPrismaClient(options);
  }
};
