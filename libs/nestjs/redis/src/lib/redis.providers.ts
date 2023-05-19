import { FactoryProvider, Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { defaultRedisModuleOptions } from './default-options';
import { RedisClientError } from './redis-client.error';
import {
  DEFAULT_REDIS_NAMESPACE,
  REDIS_CLIENTS,
  REDIS_MERGED_MODULE_OPTIONS,
  REDIS_MODULE_OPTIONS,
} from './redis.constants';
import { namespaces } from './redis.decorator';
import {
  ClientNamespace,
  RedisClient,
  RedisClientOptions,
  RedisClients,
  RedisModuleAsyncOptions,
  RedisModuleOptions,
  RedisOptionsFactory,
} from './redis.interface';
import { getClient } from './redis.utils';

export const createNamespaceClientProviders = (): Provider[] => {
  const providers: Provider[] = [];
  namespaces.forEach((token, namespace) => {
    providers.push({
      provide: token,
      useFactory: (clients: RedisClients) => getClient(clients, namespace),
      inject: [REDIS_CLIENTS],
    });
  });

  return providers;
};

export const redisClientsProvider: Provider = {
  provide: REDIS_CLIENTS,
  useFactory: (options: RedisModuleOptions) => {
    const { connection } = options;
    const clients = new Map<ClientNamespace, RedisClient>();

    const isArrayOptions = Array.isArray(connection);
    const clientOptions = isArrayOptions ? connection : [connection];

    clientOptions.forEach((options) => {
      const namespace = options.namespace || DEFAULT_REDIS_NAMESPACE;

      if (clients.get(namespace)) {
        throw new RedisClientError(
          `Client with same namespace: ${String(namespace)}`,
        );
      }

      clients.set(namespace, createClient(options));
    });

    return clients;
  },
  inject: [REDIS_MERGED_MODULE_OPTIONS],
};

export const createClient = (options: RedisClientOptions): RedisClient => {
  const { onClientCreated, url, prefix = '' } = options;

  const client = new Redis(url, { keyPrefix: prefix });

  if (onClientCreated) {
    onClientCreated(client);
  }

  return client;
};

export const createOptionsProvider = (
  options: RedisModuleOptions,
): Provider => ({
  provide: REDIS_MODULE_OPTIONS,
  useValue: options,
});

export const createAsyncOptions = async (
  optionsFactory: RedisOptionsFactory,
): Promise<RedisModuleOptions> => {
  return await optionsFactory.createRedisOptions();
};

export const createAsyncOptionsProviders = (
  options: RedisModuleAsyncOptions,
): Provider[] => {
  const providers: Provider[] = [];

  if ('useFactory' in options) {
    providers.push({
      provide: REDIS_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    });
  }

  if ('useClass' in options) {
    providers.push(
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
      {
        provide: REDIS_MODULE_OPTIONS,
        useFactory: createAsyncOptions,
        inject: [options.useClass],
      },
    );
  }

  if ('useExisting' in options) {
    providers.push({
      provide: REDIS_MODULE_OPTIONS,
      useFactory: createAsyncOptions,
      inject: [options.useExisting],
    });
  }

  return providers;
};

export const mergedOptionsProvider: FactoryProvider<RedisModuleOptions> = {
  provide: REDIS_MERGED_MODULE_OPTIONS,
  useFactory: (options: RedisModuleOptions) => ({
    ...defaultRedisModuleOptions,
    ...options,
  }),
  inject: [REDIS_MODULE_OPTIONS],
};
