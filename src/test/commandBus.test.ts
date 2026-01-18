import { beforeEach, describe, expect, test, vi } from 'vitest'
import { CommandBus } from '@/providers'
import { CommandHandlerNotFoundException } from '@/errors'
import { Command, ICommandHandler } from '@/types'
import { KillDragonCommand } from '@/test/commands/killDragon.command'
import { KillDragonHandler } from '@/test/commands/killDragon.handler'

class SimpleCommand extends Command<string> {
  constructor(public readonly input: string) {
    super()
  }
}

describe('CommandBus', () => {
  let commandBus: CommandBus

  beforeEach(() => {
    commandBus = new CommandBus()
  })

  test('execute returns handler result', async () => {
    commandBus.register(new KillDragonHandler())

    const command = new KillDragonCommand(1, 1000)
    const { actionId } = await commandBus.execute(command)

    expect(actionId).toBe('1/1000')
  })

  test('execute throws CommandHandlerNotFoundException when no handler registered', () => {
    const command = new SimpleCommand('test')

    expect(() => commandBus.execute(command)).toThrow(CommandHandlerNotFoundException)
    expect(() => commandBus.execute(command)).toThrow(
      'No handler found for the command: "SimpleCommand"',
    )
  })

  test('register warns when overriding existing handler', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const handler: ICommandHandler<SimpleCommand> = {
      resolveName: () => SimpleCommand.name,
      execute: async cmd => cmd.input,
    }

    commandBus.register(handler)
    commandBus.register(handler)

    expect(consoleSpy).toHaveBeenCalledWith(
      'Command handler [SimpleCommand] is already registered. Overriding previously registered handler.',
    )

    consoleSpy.mockRestore()
  })

  test('events$ observable emits executed commands', async () => {
    const handler: ICommandHandler<SimpleCommand> = {
      resolveName: () => SimpleCommand.name,
      execute: async cmd => cmd.input,
    }

    commandBus.register(handler)

    const emittedCommands: SimpleCommand[] = []
    commandBus.events$.subscribe(cmd => {
      if (cmd instanceof SimpleCommand) {
        emittedCommands.push(cmd)
      }
    })

    await commandBus.execute(new SimpleCommand('first'))
    await commandBus.execute(new SimpleCommand('second'))

    expect(emittedCommands).toHaveLength(2)
    expect(emittedCommands[0].input).toBe('first')
    expect(emittedCommands[1].input).toBe('second')
  })

  test('bind registers handler with custom id', () => {
    const handler: ICommandHandler<SimpleCommand> = {
      resolveName: () => SimpleCommand.name,
      execute: async cmd => `bound-${cmd.input}`,
    }

    commandBus.bind(handler, 'CustomId')

    // Should not find by class name
    expect(() => commandBus.execute(new SimpleCommand('test'))).toThrow(
      CommandHandlerNotFoundException,
    )
  })
})
