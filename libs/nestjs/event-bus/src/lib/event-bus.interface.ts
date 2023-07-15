import { ConstructorOptions } from 'eventemitter2';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEvent {}

export interface IEventHandler<T extends IEvent = any> {
  handle(event: T): any;
}

export interface EventMetadata {
  id: string;
}

export interface EventBusModuleOptions extends ConstructorOptions {
  /**
   * If "true", registers `EventEmitterModule` as a global module.
   * See: https://docs.nestjs.com/modules#global-modules
   *
   * @default true
   */
  global?: boolean;
}
