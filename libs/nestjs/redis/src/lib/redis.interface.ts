import { Type, ModuleMetadata, FactoryProvider } from '@nestjs/common';
import Redis from 'ioredis';

export type RedisClient = Redis;

export type RedisClients = Map<ClientNamespace, Redis>;

export type ClientNamespace = string | symbol;

export interface RedisClientOptions {
  /**
   * Client name. If client name is not given then it will be called "default".
   * Different clients must have different names.
   *
   * Redis will
   * @defaultValue `"default"`
   */
  namespace?: ClientNamespace;

  /**
   * URI scheme to be used to specify connection options as a redis:// URL or rediss:// URL.
   *
   * - redis - https://www.iana.org/assignments/uri-schemes/prov/redis
   * - rediss - https://www.iana.org/assignments/uri-schemes/prov/rediss
   *
   * @example
   * ```ts
   * // Connect to 127.0.0.1:6380, db 4, using password "authpassword":
   * 'redis://:authpassword@127.0.0.1:6380/4'
   * ```
   */
  url: string;

  /**
   * Prefix to prepend to all keys in a command
   */
  prefix?: string;

  /**
   * Function to be executed as soon as the client is created.
   *
   * @param client - The new client created
   */
  onClientCreated?: (client: Redis) => void;
}

export interface RedisModuleOptions {
  /**
   * Client connection options for single or multiple clients
   */
  connection: RedisClientOptions | RedisClientOptions[];

  /**
   * If set to `true`, all clients will be closed automatically on nestjs application shutdown.
   *
   * @defaultValue `true`
   */
  closeClient?: boolean;
}

interface CommonProviderOptions {
  imports?: ModuleMetadata['imports'];
}

interface RedisOptionsFactoryProvider extends CommonProviderOptions {
  useFactory: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;
  inject?: FactoryProvider['inject'];
}

interface RedisOptionsClassProvider extends CommonProviderOptions {
  useClass: Type<RedisOptionsFactory>;
}

interface RedisOptionsExistingProvider extends CommonProviderOptions {
  useExisting: Type<RedisOptionsFactory>;
}

export type RedisModuleAsyncOptions =
  | RedisOptionsFactoryProvider
  | RedisOptionsClassProvider
  | RedisOptionsExistingProvider;

export interface RedisOptionsFactory {
  createRedisOptions: () => RedisModuleOptions | Promise<RedisModuleOptions>;
}
