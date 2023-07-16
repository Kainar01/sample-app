import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common'

export interface OpenAIModuleOptions {
  apiKey: string
}

interface CommonProviderOptions {
  imports?: ModuleMetadata['imports']
}

interface OpenAIOptionsFactoryProvider extends CommonProviderOptions {
  useFactory: (
    ...args: any[]
  ) => Promise<OpenAIModuleOptions> | OpenAIModuleOptions
  inject?: FactoryProvider['inject']
}

interface OpenAIOptionsClassProvider extends CommonProviderOptions {
  useClass: Type<OpenAIOptionsFactory>
}

interface OpenAIOptionsExistingProvider extends CommonProviderOptions {
  useExisting: Type<OpenAIOptionsFactory>
}

export type OpenAIModuleAsyncOptions =
  | OpenAIOptionsFactoryProvider
  | OpenAIOptionsClassProvider
  | OpenAIOptionsExistingProvider

export interface OpenAIOptionsFactory {
  createOpenAIOptions: () => OpenAIModuleOptions | Promise<OpenAIModuleOptions>
}
