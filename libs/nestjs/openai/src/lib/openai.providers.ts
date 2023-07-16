import { Provider } from '@nestjs/common'
import { Configuration, OpenAIApi } from 'openai'

import { OPENAI_MODULE_OPTIONS } from './openai.constants'
import {
  OpenAIModuleAsyncOptions,
  OpenAIModuleOptions,
  OpenAIOptionsFactory,
} from './openai.interface'

export const createOptionsProvider = (
  options: OpenAIModuleOptions,
): Provider => ({
  provide: OPENAI_MODULE_OPTIONS,
  useValue: options,
})

export const createAsyncOptions = async (
  optionsFactory: OpenAIOptionsFactory,
): Promise<OpenAIModuleOptions> => {
  return await optionsFactory.createOpenAIOptions()
}

export const createAsyncOptionsProviders = (
  options: OpenAIModuleAsyncOptions,
): Provider[] => {
  const providers: Provider[] = []

  if ('useFactory' in options) {
    providers.push({
      provide: OPENAI_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    })
  }

  if ('useClass' in options) {
    providers.push(
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
      {
        provide: OPENAI_MODULE_OPTIONS,
        useFactory: createAsyncOptions,
        inject: [options.useClass],
      },
    )
  }

  if ('useExisting' in options) {
    providers.push({
      provide: OPENAI_MODULE_OPTIONS,
      useFactory: createAsyncOptions,
      inject: [options.useExisting],
    })
  }

  return providers
}

export const openAIClientProvider: Provider = {
  provide: OpenAIApi,
  useFactory: (options: OpenAIModuleOptions) => {
    const { apiKey } = options

    const configuration = new Configuration({
      apiKey,
    })

    return new OpenAIApi(configuration)
  },
  inject: [OPENAI_MODULE_OPTIONS],
}
