import { Test } from '@nestjs/testing';
import { getRedisToken, RedisClient } from '@techbridge/nestjs/redis';

import { AuthUser } from './auth.interface';
import { RedisAuthService } from './redis-auth.service';

describe('RedisAuthService', () => {
  let service: RedisAuthService;
  let redisClient: RedisClient;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RedisAuthService,
        {
          provide: getRedisToken('auth'),
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<RedisAuthService>(RedisAuthService);
    redisClient = moduleRef.get<RedisClient>(getRedisToken('auth'));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getUser', () => {
    it('should get user from Redis', async () => {
      const testUser: AuthUser = { userId: 1, isAdmin: false, roles: [] };

      redisClient.get = jest.fn().mockResolvedValue(JSON.stringify(testUser));

      expect(await service.getUser(1)).toEqual(testUser);
      expect(redisClient.get).toHaveBeenCalledWith('auth:user:1');
    });

    it('should return null when user not found', async () => {
      redisClient.get = jest.fn().mockResolvedValue(null);

      expect(await service.getUser(1)).toBeNull();
      expect(redisClient.get).toHaveBeenCalledWith('auth:user:1');
    });
  });

  describe('setUser', () => {
    it('should set user to Redis', async () => {
      const testUser: AuthUser = { userId: 1, isAdmin: false, roles: [] };
      await service.setUser(testUser);

      expect(redisClient.set).toHaveBeenCalledWith(
        'auth:user:1',
        JSON.stringify(testUser),
        'EX',
        expect.any(Number),
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user from Redis', async () => {
      await service.deleteUser(1);
      expect(redisClient.del).toHaveBeenCalledWith('auth:user:1');
    });
  });
});
