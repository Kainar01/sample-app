import { RedisClientError } from './redis-client.error';
import { REDIS_EVENTS } from './redis.enum';
import { ClientNamespace, RedisClients } from './redis.interface';

export const destroy = async (clients: RedisClients) => {
  const promises: Promise<
    [PromiseSettledResult<ClientNamespace>, PromiseSettledResult<'OK'>]
  >[] = [];
  clients.forEach((client, namespace) => {
    if (client.status === REDIS_EVENTS.END) return;
    if (client.status === REDIS_EVENTS.READY) {
      promises.push(Promise.allSettled([namespace, client.quit()]));
      return;
    }
    client.disconnect();
  });
  return await Promise.all(promises);
};

export const getClient = (
  clients: RedisClients,
  namespace: ClientNamespace,
) => {
  // const client = clients[namespace];
  const client = clients.get(namespace);

  if (!client) {
    throw new RedisClientError(
      `Redis client "${String(namespace)}" does not exist`,
    );
  }

  return client;
};
