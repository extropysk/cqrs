import { QueryHandlerNotFoundException } from '@/errors'
import { IQuery, IQueryBus, IQueryHandler, Query } from '@/types'
import { ObservableBus } from '@/utils'

export class QueryBus<QueryBase extends IQuery = IQuery>
  extends ObservableBus<QueryBase>
  implements IQueryBus<QueryBase>
{
  private handlers = new Map<string, (query: QueryBase) => any>()

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
    const commandName = query.resolveName()
    const handler = this.handlers.get(commandName)
    if (!handler) {
      throw new QueryHandlerNotFoundException(commandName)
    }
    this.publisher.publish(query)
    return handler(query)
  }

  bind<T extends QueryBase>(handler: IQueryHandler<T>, id: string) {
    this.handlers.set(id, command => handler.execute(command as T & Query<unknown>))
  }

  register(handler: IQueryHandler<QueryBase>) {
    const queryName = handler.resolveName()

    if (this.handlers.has(queryName)) {
      console.warn(
        `Query handler [${queryName}] is already registered. Overriding previously registered handler.`,
      )
    }

    this.bind(handler, queryName)
  }
}
