import { DynamicModule, Module, OnApplicationBootstrap } from '@nestjs/common';
import { EventBus } from './event-bus';
import { ExplorerService } from './explorer.service';
import { EventEmitter2 } from 'eventemitter2';
import { EventBusModuleOptions } from './event-bus.interface';

@Module({})
export class EventBusModule implements OnApplicationBootstrap {
  constructor(
    private readonly explorerService: ExplorerService,
    private readonly eventBus: EventBus,
  ) {}

  public onApplicationBootstrap() {
    this.eventBus.register(this.explorerService.getEventsHandlers());
  }

  static forRoot({
    global = true,
    ...options
  }: EventBusModuleOptions = {}): DynamicModule {
    return {
      global,
      module: EventBusModule,
      providers: [
        EventBus,
        ExplorerService,
        {
          provide: EventEmitter2,
          useValue: new EventEmitter2(options),
        },
      ],
      exports: [EventBus, EventEmitter2],
    };
  }
}
