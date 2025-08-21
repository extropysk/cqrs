export interface IEvent {}

/**
 * Represents an event handler.
 */
export interface IEventHandler<T extends IEvent = any> {
  /**
   * Handles an event.
   * @param event The event to handle.
   */
  handle(event: T): any
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

export interface IEventPublisher<EventBase extends IEvent = IEvent> {
  /**
   * Publishes an event.
   * @param event The event to publish.
   * @param dispatcherContext Dispatcher context or undefined.
   * @param asyncContext The async context (if scoped).
   */
  publish<TEvent extends EventBase>(event: TEvent): any

  /**
   * Publishes multiple events.
   * @param events The events to publish.
   * @param dispatcherContext Dispatcher context or undefined.
   * @param asyncContext The async context (if scoped).
   */
  publishAll?<TEvent extends EventBase>(events: TEvent[]): any
}
