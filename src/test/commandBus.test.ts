import { beforeAll, expect, test } from 'vitest'
import { CommandBus } from '../providers'
import { KillDragonCommand } from './commands/killDragon.command'
import { KillDragonHandler } from './commands/killDragon.handler'
import { eventBus } from './eventBus'
import { HeroKilledDragonHandler } from './events/heroKilledDragon.handler'

const commandBus = new CommandBus()

beforeAll(async () => {
  commandBus.register(new KillDragonHandler())
  eventBus.register(new HeroKilledDragonHandler())
})

test('kill dragon command', async () => {
  const command = new KillDragonCommand(1, 1000)
  const { actionId } = await commandBus.execute(command)

  expect(actionId).toBe('1/1000')
})
