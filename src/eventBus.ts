import { Constructor, IEvent, IEventBus, IEventHandler } from './types'
import { EventEmitter } from 'events'

export class EventBus<EventBase extends IEvent = IEvent>
  extends EventEmitter
  implements IEventBus<EventBase>
{
  constructor() {
    super()
    // Increase max listeners for high-throughput scenarios
    this.setMaxListeners(100)
  }

  register(event: Constructor<IEvent>, handler: IEventHandler) {
    const eventName = event.name

    this.on(eventName, async event => {
      try {
        await handler.handle(event)
        // this.emit('event.handled', {
        //   event,
        //   handler: handler.constructor.name,
        //   timestamp: new Date(),
        // })
      } catch (error) {
        // this.emit('event.error', {
        //   event,
        //   error,
        //   handler: handler.constructor.name,
        //   timestamp: new Date(),
        // })
        console.error(`Error handling event ${eventName}:`, error)
      }
    })
  }

  /**
   * Publishes an event.
   * @param event The event to publish.
   */
  publish<TEvent extends EventBase>(event: TEvent): any
  /**
   * Publishes an event.
   * @param event The event to publish.
   * @param asyncContext Async context
   */
  publish<TEvent extends EventBase>(event: TEvent, asyncContext: unknown): any
  /**
   * Publishes an event.
   * @param event The event to publish.
   * @param dispatcherContext Dispatcher context
   */
  publish<TEvent extends EventBase, TContext = unknown>(
    event: TEvent,
    dispatcherContext: TContext,
  ): any
  /**
   * Publishes an event.
   * @param event The event to publish.
   * @param dispatcherContext Dispatcher context
   * @param asyncContext Async context
   */
  publish<TEvent extends EventBase, TContext = unknown>(
    event: TEvent,
    dispatcherContext: TContext,
    asyncContext: unknown,
  ): any
  /**
   * Publishes an event.
   * @param event The event to publish.
   * @param dispatcherOrAsyncContext Dispatcher context or async context
   * @param asyncContext Async context
   */
  publish<TEvent extends EventBase, TContext = unknown>(
    event: TEvent,
    dispatcherOrAsyncContext?: TContext | unknown,
    asyncContext?: unknown,
  ) {
    const eventName = event.constructor.name
    this.emit(eventName, event)
  }
}
