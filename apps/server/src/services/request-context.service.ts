import { RequestContext } from 'nestjs-request-context';

import { AppAbility } from '../core/permission/permission.interface';
import { PrismaTransactionClient } from '../prisma/prisma.interface';

/**
 * Setting some isolated context for each request.
 */
export class AppRequestContext extends RequestContext {
  public ability: AppAbility;
  public prismaTransactionClient: PrismaTransactionClient;
}

export class RequestContextService {
  public static getContext(): AppRequestContext {
    const ctx: AppRequestContext = RequestContext.currentContext.req;
    return ctx;
  }

  public static setAbility(ability: AppAbility): void {
    const ctx = this.getContext();
    ctx.ability = ability;
  }

  public static getAbility(): AppAbility {
    return this.getContext().ability;
  }

  public static setPrismaTransaction(
    prismaTransactionClient: PrismaTransactionClient,
  ): void {
    const ctx = this.getContext();
    ctx.prismaTransactionClient = prismaTransactionClient;
  }

  public static getPrismaTransaction(): PrismaTransactionClient {
    const ctx = this.getContext();
    return ctx.prismaTransactionClient;
  }

  public static cleanPrismaTransaction(): void {
    const ctx = this.getContext();
    ctx.prismaTransactionClient = undefined;
  }
}
