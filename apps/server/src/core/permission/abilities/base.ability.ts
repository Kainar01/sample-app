import { AuthUser } from '../../auth/auth.interface';
import { SubjectAbility, Subject } from '../permission.interface';

export abstract class BaseSubjectAbility<S extends Subject, T> {
  /**
   * defines ability on given subject
   * @param abilityBuilder casl ability builder
   * @param user `AuthUser`
   */
  public abstract define(
    abilityBuilder: SubjectAbility<S, T>,
    user: AuthUser,
  ): void;
}
