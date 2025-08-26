export interface IEvent {
  resolveName(): string
}

export abstract class BaseEvent implements IEvent {
  resolveName(): string {
    return this.constructor.name
  }
}

/**
 * Represents an event handler.
 */
export interface IEventHandler<T extends IEvent = any> {
  /**
   * Handles an event.
   * @param event The event to handle.
   */
  handle(event: T): any
  resolveName(): string
}

/**
 * Represents an event bus.
 */
export interface IEventBus<EventBase extends IEvent = IEvent> {
  /**
   * Publishes an event.
   * @param event The event to publish.
   */
  publish<TEvent extends EventBase>(event: TEvent): any

  /**
   * Publishes multiple events.
   * @param events The events to publish.
   */
  publishAll<TEvent extends EventBase>(events: TEvent[]): any
}
