import { catchError, defer, filter, mergeMap, of, Subscription } from 'rxjs'
import { IEvent, IEventBus, IEventHandler } from '../types'
import { ObservableBus } from '../utils'

export class EventBus<EventBase extends IEvent = IEvent>
  extends ObservableBus<EventBase>
  implements IEventBus<EventBase>
{
  protected readonly subscriptions: Subscription[]

  constructor() {
    super()

    this.subscriptions = []
  }

  bind(handler: IEventHandler<EventBase>, id: string) {
    const deferred = (event: EventBase) => () => {
      return Promise.resolve(handler.handle(event))
    }

    const subscription = this.subject$
      .pipe(
        filter(event => {
          return event.resolveName() === id
        }),
      )
      .pipe(
        mergeMap(event =>
          defer(deferred(event)).pipe(
            catchError(error => {
              // if (this.options?.rethrowUnhandled) {
              //   throw error
              // }

              console.error(`"${handler.resolveName()}" has thrown an unhandled exception.`, error)
              return of()
            }),
          ),
        ),
      )
      .subscribe()

    this.subscriptions.push(subscription)
  }

  register(handler: IEventHandler) {
    const eventName = handler.resolveName()

    this.bind(handler, eventName)
  }

  /**
   * Publishes an event.
   * @param event The event to publish.
   */
  publish<TEvent extends EventBase>(event: TEvent) {
    return this.publisher.publish(event)
  }

  /**
   * Publishes multiple events.
   * @param events The events to publish.
   */
  publishAll<TEvent extends EventBase>(events: TEvent[]) {
    return (events || []).map(event => this.publisher.publish(event))
  }
}
