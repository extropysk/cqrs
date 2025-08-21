import { CommandHandlerNotFoundException } from './errors'
import {
  Command,
  Constructor,
  ICommand,
  ICommandBus,
  ICommandHandler,
  ICommandPublisher,
} from './types'
import { ObservableBus } from './utils'
import { DefaultCommandPubSub } from './utils/defaultPubSub'

export class CommandBus<CommandBase extends ICommand = ICommand>
  extends ObservableBus<CommandBase>
  implements ICommandBus<CommandBase>
{
  private handlers = new Map<string, (command: CommandBase) => any>()
  private _publisher: ICommandPublisher<CommandBase>

  constructor() {
    super()
    this._publisher = new DefaultCommandPubSub<CommandBase>(this.subject$)
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
    const executeFn = this.handlers.get(commandName)
    if (!executeFn) {
      throw new CommandHandlerNotFoundException(commandName)
    }
    this._publisher.publish(command)
    return executeFn(command)
  }

  bind<T extends CommandBase>(handler: ICommandHandler<T>, id: string) {
    this.handlers.set(id, command => handler.execute(command as T & Command<unknown>))
  }

  register(command: Constructor<ICommand>, handler: ICommandHandler<CommandBase>) {
    const commandName = command.name

    if (this.handlers.has(commandName)) {
      console.warn(
        `Command handler [${commandName}] is already registered. Overriding previously registered handler.`,
      )
    }

    this.bind(handler, commandName)
  }
}
