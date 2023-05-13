import { subject as caslSubject } from '@casl/ability';
import { ForbiddenError } from '@nestjs/apollo';

import { createAbilityForUser } from './casl.factory';
import {
  Action,
  AppAbility,
  Subject,
  SubjectAction,
} from './permission.interface';
import { RequestContextService } from '../../services/request-context.service';
import { AuthUser } from '../auth/auth.interface';

function parseAction(actionType: SubjectAction): [Subject, Action] {
  const [subject, action] = actionType.split('.');

  return [<Subject>subject, <Action>action];
}

/**
 * Gets ability from request context or creates
 * @param user current user
 * @returns ability
 */
function getCtxAbility(user: AuthUser): AppAbility {
  let ability = RequestContextService.getAbility();

  if (!ability) {
    ability = createAbilityForUser(user);
    RequestContextService.setAbility(ability);
  }

  return ability;
}

/**
 * This function is used to authorize an action performed by an actor on a subject.
 * It takes in the authenticated user (`actor`), the type of action to be performed (`actionType`),
 * and the subject on which the action is to be performed (`subject`).
 *
 * It works by first parsing the `actionType` to extract the subject name and action.
 * Then, it retrieves the actor's abilities from the application context.
 * After that, it checks if the actor has the ability to perform the given action on the subject.
 *
 * If the actor is not allowed to perform the action, the function throws a `ForbiddenError`.
 *
 * @param {AuthUser} actor - The authenticated user who is trying to perform the action.
 * @param {SubjectAction} actionType - The type of action to be performed, represented as a string in the form 'subject.action'.
 * @param {any} subject - The subject on which the action is to be performed. Can be of any type.
 *
 * @throws {ForbiddenError} If the actor is not allowed to perform the action on the subject.
 */
export function authorize(
  actor: AuthUser,
  actionType: SubjectAction,
  subject: any,
): void {
  const [subjectName, action] = parseAction(actionType);
  const ability = getCtxAbility(actor);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const isAllowed = ability.can(action, caslSubject(subjectName, subject));

  if (!isAllowed) {
    throw new ForbiddenError('Not Allowed');
  }
}
