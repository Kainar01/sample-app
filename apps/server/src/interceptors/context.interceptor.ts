import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthUser } from '../core/auth/auth.interface';
import { CaslAbilityFactory } from '../core/permission/casl.factory';
import { RequestContextService } from '../services/request-context.service';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  constructor(private readonly caslAbilityFactory: CaslAbilityFactory) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();

    /**
     * Setting an ID in the global context for each request.
     * This ID can be used as correlation id shown in logs
     */
    const user: AuthUser = request?.user;

    if (user) {
      const ability = this.caslAbilityFactory.createAbilityForUser(user);

      RequestContextService.setAbility(ability);
    }

    return next.handle();
  }
}
