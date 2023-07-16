import { DynamicModule, Module, Provider } from '@nestjs/common'

import {
  OpenAIModuleAsyncOptions,
  OpenAIModuleOptions,
} from './openai.interface'
import {
  createAsyncOptionsProviders,
  createOptionsProvider,
  openAIClientProvider,
} from './openai.providers'

@Module({})
export class OpenAIModule {
  static register(
    options: OpenAIModuleOptions,
    isGlobal = true,
  ): DynamicModule {
    const providers: Provider[] = [
      createOptionsProvider(options),
      openAIClientProvider,
    ]

    return {
      global: isGlobal,
      module: OpenAIModule,
      exports: [openAIClientProvider],
      providers,
    }
  }

  static registerAsync(
    options: OpenAIModuleAsyncOptions,
    isGlobal = true,
  ): DynamicModule {
    const providers: Provider[] = [
      ...createAsyncOptionsProviders(options),
      openAIClientProvider,
    ]

    return {
      global: isGlobal,
      module: OpenAIModule,
      imports: options.imports,
      exports: [openAIClientProvider],
      providers,
    }
  }
}
