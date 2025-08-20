import { expect, test } from 'vitest'
import { Command, ICommandHandler } from './types'
import { CommandBus } from './commandBus'

export class KillDragonCommand extends Command<{
  actionId: string
}> {
  constructor(
    public readonly heroId: string,
    public readonly dragonId: string,
  ) {
    super()
  }
}

export class KillDragonHandler implements ICommandHandler<KillDragonCommand> {
  constructor() {}

  async execute(_command: KillDragonCommand) {
    return {
      actionId: 'TT',
    }
  }
}

test('adds 1 + 2 to equal 3', async () => {
  const commandBus = new CommandBus()
  commandBus.register(KillDragonCommand, new KillDragonHandler())

  const command = new KillDragonCommand('1', '2')
  await commandBus.execute(command)

  expect(3).toBe(3)
})
