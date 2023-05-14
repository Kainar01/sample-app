import { AbilityBuilder, MongoAbility, InferSubjects } from '@casl/ability';

import { Actions } from './permission.contants';

/**
 * `Action` is a union of all actions across all subjects
 */
export type Action = (typeof Actions)[Subject][number];

/**
 * `Subject` is a union of subject names
 */
export type Subject = keyof typeof Actions;

/**
 * `SubjectAction` is a mapped type that generates a union of string literals,
 * where each string literal represents a specific action that a particular subject can perform.
 *
 * It works by mapping over each key `S` in the `Subject` type.
 * For each `S`, it constructs a string literal of the form `S.Action`,
 * where `Action` is a possible action that the subject `S` can perform as defined in the `Actions` object.
 *
 * Examples: `user.read | user.update | user.delete`
 *
 * @template S The subject type, which must be a subtype of `Subject`.
 * @type { `${S}.${(typeof Actions)[S][number]}` }
 */
export type SubjectAction = {
  [S in Subject]: `${S}.${(typeof Actions)[S][number]}`;
}[Subject];

/**
 * The `CaslSubject` type is a helper type that augments a given subject type `T` with a `kind` property.
 * The `kind` property is assigned a string value that identifies the type of the subject.
 *
 * This is primarily useful for integrating with libraries such as CASL, which rely on a property (like `kind`)
 * to distinguish between different types of subjects. By adding a `kind` property, TypeScript's type system
 * can ensure that the correct subject type is used in the right context.
 *
 * @template S The subject kind, which must be a subtype of `Subject`.
 * @template T The actual type of the subject.
 *
 * @type { T & { kind: S } } An intersection type that represents the subject type `T` augmented with a `kind` property.
 */
export type CaslSubject<S extends Subject, T> = T & { kind: S };

/**
 * A generic type for building abilities (permissions).
 *
 * The `SubjectAbility` type takes two type parameters:
 * - `S`, which should be a subtype of `Subject`. This represents the "subject" or the object upon which the action is being performed (e.g., a user, a blog post, etc.).
 * - `T`, which is a generic type that will be used to infer the actual type of the subject.
 *
 * `SubjectAbility` uses `AbilityBuilder` to construct the ability, where an ability represents a set of actions that a subject can perform.
 *
 * @template S The subject type, which must be a subtype of `Subject`.
 * @template T The actual type of the subject, which is inferred dynamically.
 * @type {AbilityBuilder<MongoAbility<[(typeof Actions)[S][number], InferSubjects<CaslSubject<S, T>>]>}
 */
export type SubjectAbility<S extends Subject, T> = AbilityBuilder<
  MongoAbility<[(typeof Actions)[S][number], InferSubjects<CaslSubject<S, T>>]>
>;

export type AppAbility = MongoAbility<[string, any]>;
