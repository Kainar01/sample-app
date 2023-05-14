import { Test } from '@nestjs/testing';

import { CoreService } from './core.service';

describe('AppService', () => {
  let service: CoreService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [CoreService],
    }).compile();

    service = app.get<CoreService>(CoreService);
  });

  describe('getData', () => {
    it('should return "Welcome to sample!"', () => {
      expect(service.getData()).toEqual({ message: 'Welcome to sample!' });
    });
  });
});
