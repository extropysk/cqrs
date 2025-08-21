import { Subject } from 'rxjs'
import { ICommand, ICommandPublisher, IEvent, IEventPublisher } from '../types'
import { IQuery, IQueryPublisher } from '../types/queries'

export interface IMessageSource<EventBase extends IEvent = IEvent> {
  bridgeEventsTo<T extends EventBase>(subject: Subject<T>): any
}

export class DefaultCommandPubSub<CommandBase extends ICommand>
  implements ICommandPublisher<CommandBase>
{
  constructor(private subject$: Subject<CommandBase>) {}

  publish<T extends CommandBase>(command: T) {
    this.subject$.next(command)
  }
}

export class DefaultPubSub<EventBase extends IEvent>
  implements IEventPublisher<EventBase>, IMessageSource<EventBase>
{
  constructor(private subject$: Subject<EventBase>) {}

  publish<T extends EventBase>(event: T) {
    this.subject$.next(event)
  }

  bridgeEventsTo<T extends EventBase>(subject: Subject<T>) {
    this.subject$ = subject as unknown as Subject<EventBase>
  }
}

export class DefaultQueryPubSub<QueryBase extends IQuery> implements IQueryPublisher<QueryBase> {
  constructor(private subject$: Subject<QueryBase>) {}

  publish<T extends QueryBase>(query: T) {
    this.subject$.next(query)
  }
}
