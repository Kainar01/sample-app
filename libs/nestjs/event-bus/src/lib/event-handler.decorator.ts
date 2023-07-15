import { EVENTS_HANDLER_METADATA } from './event-bus.contants';
import { IEvent } from './event-bus.interface';

export const EventsHandler = <EventBase extends IEvent>(
  ...events: (new (...args: any[]) => EventBase)[]
): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(EVENTS_HANDLER_METADATA, events, target);
  };
};
