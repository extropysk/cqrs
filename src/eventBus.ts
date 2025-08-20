import { Constructor, IEvent, IEventBus, IEventHandler } from './types'
import { Observable } from './utils'

export class EventBus<EventBase extends IEvent = IEvent>
  extends Observable
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
  publish<TEvent extends EventBase>(event: TEvent) {
    const eventName = event.constructor.name
    this.emit(eventName, event)
  }
}
