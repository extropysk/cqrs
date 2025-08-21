import { QueryHandlerNotFoundException } from '../errors'
import { Constructor } from '../types'
import { IQuery, IQueryBus, IQueryHandler, IQueryPublisher, Query } from '../types/queries'
import { ObservableBus } from '../utils'
import { DefaultQueryPubSub } from '../utils/defaultPubSub'

export class QueryBus<QueryBase extends IQuery = IQuery>
  extends ObservableBus<QueryBase>
  implements IQueryBus<QueryBase>
{
  private handlers = new Map<string, (query: QueryBase) => any>()
  private _publisher: IQueryPublisher<QueryBase>

  constructor() {
    super()

    this._publisher = new DefaultQueryPubSub<QueryBase>(this.subject$)
  }

  /**
   * Executes a query.
   * @param query The query to execute.
   */
  execute<TResult>(query: Query<TResult>): Promise<TResult>
  /**
   * Executes a query.
   * @param query The query to execute.
   */
  async execute<T extends QueryBase, TResult = any>(query: T): Promise<TResult>
  /**
   * Executes a query.
   * @param query The query to execute.
   */
  async execute<T extends QueryBase, TResult = any>(query: T): Promise<TResult> {
    const commandName = query.constructor.name
    const handler = this.handlers.get(commandName)
    if (!handler) {
      throw new QueryHandlerNotFoundException(commandName)
    }
    this._publisher.publish(query)
    return handler(query)
  }

  bind<T extends QueryBase>(handler: IQueryHandler<T>, id: string) {
    this.handlers.set(id, command => handler.execute(command as T & Query<unknown>))
  }

  register(query: Constructor<IQuery>, handler: IQueryHandler<QueryBase>) {
    const queryName = query.name

    if (this.handlers.has(queryName)) {
      console.warn(
        `Query handler [${queryName}] is already registered. Overriding previously registered handler.`,
      )
    }

    this.bind(handler, queryName)
  }
}
