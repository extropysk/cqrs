import { CommandHandlerNotFoundException } from './errors/commandNotFound'
import { Command, Constructor, ICommand, ICommandBus, ICommandHandler } from './types'
import { Observable } from './utils'

export class CommandBus<CommandBase extends ICommand = ICommand>
  extends Observable
  implements ICommandBus<CommandBase>
{
  private handlers: Map<string, ICommandHandler>

  constructor() {
    super()
    this.handlers = new Map()
  }

  /**
   * Executes a command.
   * @param command The command to execute.
   * @returns A promise that, when resolved, will contain the result returned by the command's handler.
   */
  execute<R = void>(command: Command<R>): Promise<R>
  /**
   * Executes a command.
   * @param command The command to execute.
   * @param context The context to use. Optional.
   * @returns A promise that, when resolved, will contain the result returned by the command's handler.
   */
  execute<T extends CommandBase, R = any>(command: T): Promise<R> {
    const commandName = command.constructor.name
    const handler = this.handlers.get(commandName)
    if (!handler) {
      throw new CommandHandlerNotFoundException(commandName)
    }
    return handler.execute(command)
  }

  register(command: Constructor<ICommand>, handler: ICommandHandler<CommandBase>) {
    const commandName = command.name

    if (this.handlers.has(commandName)) {
      console.warn(
        `Command handler [${commandName}] is already registered. Overriding previously registered handler.`,
      )
    }

    this.handlers.set(commandName, handler)
  }
}
