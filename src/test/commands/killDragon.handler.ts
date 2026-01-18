import { ICommandHandler } from '@/types'
import { KillDragonCommand } from '@/test/commands/killDragon.command'

export class KillDragonHandler implements ICommandHandler<KillDragonCommand> {
  resolveName(): string {
    return KillDragonCommand.name
  }

  async execute(command: KillDragonCommand) {
    const { heroId, dragonId } = command

    // "ICommandHandler<KillDragonCommand>" forces you to return a value that matches the command's return type
    return {
      actionId: `${heroId}/${dragonId}`,
    }
  }
}
