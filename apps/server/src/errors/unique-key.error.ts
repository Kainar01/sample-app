import { ApolloError } from 'apollo-server-errors';

export class UniqueKeyError extends ApolloError {
  constructor(fields: string[]) {
    super(
      `Another record with the same key already exist (${fields.join(', ')})`,
    );
  }
}
