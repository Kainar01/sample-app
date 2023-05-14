import { Test, TestingModule } from '@nestjs/testing';

import { CoreController } from './core.controller';
import { CoreService } from './core.service';

describe('CoreController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [CoreController],
      providers: [CoreService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Welcome to sample!"', () => {
      const appController = app.get<CoreController>(CoreController);
      expect(appController.getData()).toEqual({
        message: 'Welcome to sample!',
      });
    });
  });
});
