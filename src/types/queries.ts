const RESULT_TYPE_SYMBOL = Symbol('RESULT_TYPE')

export interface IQuery {}

/**
 * Utility type to extract the result type of a query.
 */
export type QueryResult<C extends Query<unknown>> = C extends Query<infer R> ? R : never

export class Query<T> implements IQuery {
  readonly [RESULT_TYPE_SYMBOL]: T
}

/**
 * Represents a query handler.
 *
 * @publicApi
 */
export type IQueryHandler<T extends IQuery = any, TRes = any> =
  T extends Query<infer InferredQueryResult>
    ? {
        /**
         * Executes a query.
         * @param query The query to execute.
         */
        execute(query: T): Promise<InferredQueryResult>
      }
    : {
        /**
         * Executes a query.
         * @param query The query to execute.
         */
        execute(query: T): Promise<TRes>
      }

/**
 * Represents a query bus.
 *
 * @publicApi
 */
export interface IQueryBus<QueryBase extends IQuery = IQuery> {
  /**
   * Executes a query.
   * @param query The query to execute.
   */
  execute<TResult>(query: Query<TResult>): Promise<TResult>
  /**
   * Executes a query.
   * @param query The query to execute.
   */
  execute<T extends QueryBase, TResult = any>(query: T): Promise<TResult>
}
