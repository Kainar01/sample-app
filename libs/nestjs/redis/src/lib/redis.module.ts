import { DynamicModule, OnApplicationShutdown, Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { REDIS_CLIENTS, REDIS_MERGED_MODULE_OPTIONS } from './redis.constants';
import {
  RedisModuleOptions,
  RedisModuleAsyncOptions,
  RedisClients,
} from './redis.interface';
import {
  createAsyncOptionsProviders,
  createOptionsProvider,
  createNamespaceClientProviders,
  mergedOptionsProvider,
  redisClientsProvider,
} from './redis.providers';
import { destroy } from './redis.utils';
import { ModuleRef } from '@nestjs/core';

@Module({})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  static forRoot(options: RedisModuleOptions, isGlobal = true): DynamicModule {
    const namespaceClientProviders = createNamespaceClientProviders();

    const providers: Provider[] = [
      createOptionsProvider(options),
      mergedOptionsProvider,
      redisClientsProvider,
      ...namespaceClientProviders,
    ];

    return {
      global: isGlobal,
      module: RedisModule,
      exports: [redisClientsProvider, ...namespaceClientProviders],
      providers,
    };
  }

  static forRootAsync(
    options: RedisModuleAsyncOptions,
    isGlobal = true,
  ): DynamicModule {
    const namespaceClientProviders = createNamespaceClientProviders();

    const providers: Provider[] = [
      ...createAsyncOptionsProviders(options),
      mergedOptionsProvider,
      redisClientsProvider,
      ...namespaceClientProviders,
    ];

    return {
      global: isGlobal,
      module: RedisModule,
      imports: options.imports,
      exports: [redisClientsProvider, ...namespaceClientProviders],
      providers,
    };
  }

  async onApplicationShutdown(): Promise<void> {
    const { closeClient } = this.moduleRef.get<RedisModuleOptions>(
      REDIS_MERGED_MODULE_OPTIONS,
    );

    if (closeClient) {
      const results = await destroy(
        this.moduleRef.get<RedisClients>(REDIS_CLIENTS),
      );
      results.forEach(([namespace, quit]) => {
        if (namespace.status === 'fulfilled' && quit.status === 'rejected') {
          console.error(
            `${String(namespace.value)}: ${quit.reason.message}`,
            quit.reason.stack,
          );
        }
      });
    }
  }
}
