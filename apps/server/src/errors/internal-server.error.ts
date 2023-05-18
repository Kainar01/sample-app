import { ApolloError } from 'apollo-server-errors';

export class InternalServerError extends ApolloError {
  constructor() {
    super('Internal server error');
  }
}
