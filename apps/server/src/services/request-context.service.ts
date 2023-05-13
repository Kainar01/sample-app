import { RequestContext } from 'nestjs-request-context';

import { AppAbility } from '../core/permission/permission.interface';

/**
 * Setting some isolated context for each request.
 */
export class AppRequestContext extends RequestContext {
  public ability: AppAbility;
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
}
