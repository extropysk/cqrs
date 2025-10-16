import { IEventHandler } from '@/types'
import { HeroKilledDragonEvent } from '@/test/events/heroKilledDragon.event'

export class HeroKilledDragonHandler implements IEventHandler<HeroKilledDragonEvent> {
  resolveName(): string {
    return HeroKilledDragonEvent.name
  }

  handle(event: HeroKilledDragonEvent) {
    console.log(`Dragon ${event.dragonId} was killed by ${event.heroId}.`)
  }
}
