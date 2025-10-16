import { ICommandHandler } from '@/types'
import { eventBus } from '@/test/eventBus'
import { HeroKilledDragonEvent } from '@/test/events/heroKilledDragon.event'
import { KillDragonCommand } from '@/test/commands/killDragon.command'

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
