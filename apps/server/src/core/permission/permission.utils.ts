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

/**
 * Takes `SubjectAction` as argument and returns parsed subject and action.
 *
 * user.read => `[user, read]`
 *
 * @param actionType `SubjectAction` in format subject.action
 * @returns [`Subject`, `Action`]
 */
export const parseSubjectAction = (
  actionType: SubjectAction,
): [Subject, Action] => {
  const [subject, action] = actionType.split('.');

  return [<Subject>subject, <Action>action];
};

/**
 * Gets ability from request context or creates
 * @param user current user
 * @returns ability
 */
export const getCtxAbility = (user: AuthUser): AppAbility => {
  let ability = RequestContextService.getAbility();

  if (!ability) {
    ability = createAbilityForUser(user);
    RequestContextService.setAbility(ability);
  }

  return ability;
};

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
 * @param {SubjectAction} subjectAction - The type of action to be performed, represented as a string in the form 'subject.action'.
 * @param {any} targetEntity - The subject on which the action is to be performed. Can be of any type.
 *
 * @throws {ForbiddenError} If the actor is not allowed to perform the action on the subject.
 */
export const authorize = (
  actor: AuthUser,
  subjectAction: SubjectAction,
  targetEntity: any,
): void => {
  const [subject, action] = parseSubjectAction(subjectAction);
  const ability = getCtxAbility(actor);

  // convert entity to casl subject, this is required by CASL's "can" function
  const targetSubject = caslSubject(subject, targetEntity);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const isAllowed = ability.can(action, targetSubject);

  if (!isAllowed) {
    throw new ForbiddenError('Not Allowed');
  }
};
