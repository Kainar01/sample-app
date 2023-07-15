import { Injectable, OnApplicationShutdown, Type } from '@nestjs/common';
import { IEvent, IEventHandler } from './event-bus.interface';

import { ModuleRef } from '@nestjs/core';
import { EVENTS_HANDLER_METADATA } from './event-bus.contants';
import { map, uniq } from 'lodash';
import EventEmitter2 from 'eventemitter2';

@Injectable()
export class EventBus<EventBase extends IEvent = IEvent>
  implements OnApplicationShutdown
{
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public onApplicationShutdown() {
    this.eventEmitter.removeAllListeners();
  }

  public async publish<T extends EventBase>(event: T) {
    return this.eventEmitter.emitAsync(event.constructor.name, event);
  }

  public register(handlers: Type<IEventHandler>[] = []) {
    handlers.forEach((handler) => this.registerHandler(handler));
  }

  public registerHandler(handler: Type<IEventHandler>) {
    const target = this.moduleRef.get(handler, { strict: false });

    if (!target) {
      return;
    }

    const events = this.getUniqueEvents(handler);
    console.log(events);

    events.forEach((event) => this.bindEvent(event, target));
  }

  private bindEvent(event: string, handler: IEventHandler) {
    this.eventEmitter.on(event, handler.handle.bind(handler), {
      promisify: true,
      async: true,
    });
  }

  private getUniqueEvents(handler: Type<IEventHandler>) {
    const events = this.reflectEvents(handler);

    const eventNames: string[] = map(events, 'name');

    return uniq(eventNames);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private reflectEvents(handler: Type<IEventHandler>): Type<IEventHandler>[] {
    return Reflect.getMetadata(EVENTS_HANDLER_METADATA, handler) || [];
  }
}
