/**
 * A default Error type for custom exceptions.
 * Only `ApplicationError` or other errors that extends `ApplicationError` are passed to the client
 *
 */
export class ApplicationError extends Error {}
