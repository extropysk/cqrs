import { catchError, defer, filter, mergeMap, of, Subscription } from 'rxjs'
import { Constructor, IEvent, IEventBus, IEventHandler, IEventPublisher } from '../types'
import { ObservableBus } from '../utils'
import { DefaultPubSub } from '../utils'

export class EventBus<EventBase extends IEvent = IEvent>
  extends ObservableBus<EventBase>
  implements IEventBus<EventBase>
{
  private _publisher: IEventPublisher<EventBase>
  protected readonly subscriptions: Subscription[]

  constructor() {
    super()
    this.subscriptions = []
    this._publisher = new DefaultPubSub<EventBase>(this.subject$)
  }

  bind(handler: IEventHandler<EventBase>, id: string) {
    const deferred = (event: EventBase) => () => {
      return Promise.resolve(handler.handle(event))
    }

    const subscription = this.subject$
      .pipe(
        filter(event => {
          return event.constructor.name === id
        }),
      )
      .pipe(
        mergeMap(event =>
          defer(deferred(event)).pipe(
            catchError(error => {
              // if (this.options?.rethrowUnhandled) {
              //   throw error
              // }

              console.error(
                `"${handler.constructor.name}" has thrown an unhandled exception.`,
                error,
              )
              return of()
            }),
          ),
        ),
      )
      .subscribe()

    this.subscriptions.push(subscription)
  }

  register(event: Constructor<IEvent>, handler: IEventHandler) {
    const eventName = event.name

    this.bind(handler, eventName)
  }

  /**
   * Publishes an event.
   * @param event The event to publish.
   */
  publish<TEvent extends EventBase>(event: TEvent) {
    return this._publisher.publish(event)
  }

  /**
   * Publishes multiple events.
   * @param events The events to publish.
   */
  publishAll<TEvent extends EventBase>(events: TEvent[]) {
    if (this._publisher.publishAll) {
      return this._publisher.publishAll(events)
    }
    return (events || []).map(event => this._publisher.publish(event))
  }
}
