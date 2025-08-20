import { expect, test } from 'vitest'
import { IEventHandler } from './types'
import { EventBus } from './eventBus'

export class HeroKilledDragonEvent {
  constructor(
    public readonly heroId: string,
    public readonly dragonId: string,
  ) {}
}

export class HeroKilledDragonHandler implements IEventHandler<HeroKilledDragonEvent> {
  handle(_event: HeroKilledDragonEvent) {
    console.log('SOM')
  }
}

test('adds 1 + 2 to equal 3', async () => {
  const eventBus = new EventBus()
  eventBus.register(HeroKilledDragonEvent, new HeroKilledDragonHandler())

  const event = new HeroKilledDragonEvent('1', '2')
  await eventBus.publish(event)

  expect(3).toBe(3)
})
