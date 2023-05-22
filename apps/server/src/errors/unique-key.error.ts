import { GraphQLError } from 'graphql';

export class UniqueKeyError extends GraphQLError {
  constructor(fields: string[]) {
    super(
      `Another record with the same key already exist (${fields.join(', ')})`,
    );
  }
}
