import { DynamicModule, Module, Provider } from '@nestjs/common';

import {
  OpenAIModuleAsyncOptions,
  OpenAIModuleOptions,
} from './openai.interface';
import {
  createAsyncOptionsProviders,
  createOptionsProvider,
  openAIClientProvider,
} from './openai.providers';

@Module({})
export class OpenAIModule {
  static forRoot(
    options: OpenAIModuleOptions,
    isGlobal = false,
  ): DynamicModule {
    const providers: Provider[] = [
      createOptionsProvider(options),
      openAIClientProvider,
    ];

    return {
      global: isGlobal,
      module: OpenAIModule,
      exports: [openAIClientProvider],
      providers,
    };
  }

  static forRootAsync(
    options: OpenAIModuleAsyncOptions,
    isGlobal = false,
  ): DynamicModule {
    const providers: Provider[] = [
      ...createAsyncOptionsProviders(options),
      openAIClientProvider,
    ];

    return {
      global: isGlobal,
      module: OpenAIModule,
      imports: options.imports,
      exports: [openAIClientProvider],
      providers,
    };
  }
}
