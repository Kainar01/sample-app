import { RedisModuleOptions } from './redis.interface';

export const defaultRedisModuleOptions: Partial<RedisModuleOptions> = {
  closeClient: true,
};
