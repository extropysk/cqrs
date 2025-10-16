import { beforeAll, expect, test } from 'vitest'
import { CommandBus } from '@/providers'
import { KillDragonCommand } from '@/test/commands/killDragon.command'
import { KillDragonHandler } from '@/test/commands/killDragon.handler'
import { eventBus } from '@/test/eventBus'
import { HeroKilledDragonHandler } from '@/test/events/heroKilledDragon.handler'

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
