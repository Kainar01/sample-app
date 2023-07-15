import { Injectable, Type } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { EVENTS_HANDLER_METADATA } from './event-bus.contants';
import { IEventHandler } from './event-bus.interface';

@Injectable()
export class ExplorerService {
  constructor(private readonly modulesContainer: ModulesContainer) {}

  public getEventsHandlers() {
    const modules = [...this.modulesContainer.values()];

    const handlers = modules.flatMap((module) =>
      [...module.providers.values()].map(({ metatype }) => {
        const metadata =
          metatype && Reflect.getMetadata(EVENTS_HANDLER_METADATA, metatype);

        return metadata ? metatype : undefined;
      }),
    );

    return <Type<IEventHandler>[]>handlers.filter((handler) => !!handler);
  }
}
