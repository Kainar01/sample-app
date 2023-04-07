import { DynamicModule, Global, Module } from '@nestjs/common';
import { TechbridgeLogger } from './logger.service';
import {
  TechbridgeLoggerOptions,
  TECHBRIDGE_LOGGER_MODULE_OPTIONS,
} from './types';

@Global()
@Module({})
export class TechbridgeLoggerModule {
  static forRoot(options: TechbridgeLoggerOptions): DynamicModule {
    return {
      module: TechbridgeLoggerModule,
      providers: [
        {
          provide: TECHBRIDGE_LOGGER_MODULE_OPTIONS,
          useValue: options,
        },
        TechbridgeLogger,
      ],
      exports: [TechbridgeLogger],
    };
  }
}
