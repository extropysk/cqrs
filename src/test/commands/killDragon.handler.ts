import { ICommandHandler } from '../../types'
import { eventBus } from '../eventBus'
import { HeroKilledDragonEvent } from '../events/heroKilledDragon.event'
import { KillDragonCommand } from './killDragon.command'

export class KillDragonHandler implements ICommandHandler<KillDragonCommand> {
  resolveName(): string {
    return KillDragonCommand.name
  }

  async execute(command: KillDragonCommand) {
    const { heroId, dragonId } = command

    eventBus.publish(new HeroKilledDragonEvent(heroId, dragonId))

    // "ICommandHandler<KillDragonCommand>" forces you to return a value that matches the command's return type
    return {
      actionId: `${heroId}/${dragonId}`,
    }
  }
}
