import { GraphQLError } from 'graphql';

export class InternalServerError extends GraphQLError {
  constructor() {
    super('Internal server error');
  }
}
