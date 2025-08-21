const RESULT_TYPE_SYMBOL = Symbol('RESULT_TYPE')

export interface ICommand {}

/**
 * Utility type to extract the result type of a command.
 */
export type CommandResult<C extends Command<unknown>> = C extends Command<infer R> ? R : never

export class Command<T> implements ICommand {
  readonly [RESULT_TYPE_SYMBOL]: T
}

/**
 * Represents a command handler.
 * Command handlers are used to execute commands.
 *
 * @publicApi
 */
export type ICommandHandler<TCommand extends ICommand = any, TResult = any> =
  TCommand extends Command<infer InferredCommandResult>
    ? {
        /**
         * Executes a command.
         * @param command The command to execute.
         */
        execute(command: TCommand): Promise<InferredCommandResult>
      }
    : {
        /**
         * Executes a command.
         * @param command The command to execute.
         */
        execute(command: TCommand): Promise<TResult>
      }

/**
 * Represents a command bus.
 *
 * @publicApi
 */
export interface ICommandBus<CommandBase extends ICommand = ICommand> {
  /**
   * Executes a command.
   * @param command The command to execute.
   * @returns A promise that, when resolved, will contain the result returned by the command's handler.
   */
  execute<R = void>(command: Command<R>): Promise<R>
  /**
   * Executes a command.
   * @param command The command to execute.
   * @returns A promise that, when resolved, will contain the result returned by the command's handler.
   */
  execute<T extends CommandBase, R = any>(command: T): Promise<R>
}
