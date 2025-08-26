import { BaseEvent } from '../../types'

export class HeroKilledDragonEvent extends BaseEvent {
  constructor(
    public readonly heroId: number,
    public readonly dragonId: number,
  ) {
    super()
  }
}
