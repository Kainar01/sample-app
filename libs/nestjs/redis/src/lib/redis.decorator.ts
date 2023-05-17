import { Inject } from '@nestjs/common';
import {
  DEFAULT_REDIS_NAMESPACE,
  REDIS_CLIENTS,
  REDIS_MODULE_NAME,
} from './redis.constants';
import { ClientNamespace } from './redis.interface';

export const namespaces = new Map<ClientNamespace, string | symbol>();

/**
 * This decorator is used to mark a specific constructor parameter as a redis client.
 *
 * @param namespace - Client name
 */
export const InjectRedis = (
  namespace: ClientNamespace = DEFAULT_REDIS_NAMESPACE,
): ParameterDecorator => {
  const token = getRedisToken(namespace);

  namespaces.set(namespace, token);

  return Inject(token);
};

export const InjectRedisClients = (): ParameterDecorator => {
  return Inject(REDIS_CLIENTS);
};

export const getRedisToken = (namespace: ClientNamespace): ClientNamespace => {
  if (typeof namespace === 'symbol') return namespace;

  return `${REDIS_MODULE_NAME}:${namespace}`;
};
